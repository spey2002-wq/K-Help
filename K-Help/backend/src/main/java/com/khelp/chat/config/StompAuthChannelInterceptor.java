package com.khelp.chat.config;

import com.khelp.chat.repository.ConversationRepository;
import com.khelp.security.JwtProvider;
import java.security.Principal;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ExecutorChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

/**
 * Applies the same rules to the WebSocket chat as the REST API has:
 *
 * <ul>
 *   <li>{@code CONNECT} must carry a valid access token, otherwise the connection is refused.</li>
 *   <li>{@code SUBSCRIBE} to {@code /topic/conversations/{id}} (and {@code /read}) is allowed only
 *       for the two people in that conversation.</li>
 *   <li>Any other {@code /topic} destination is closed to clients.</li>
 * </ul>
 *
 * It also puts the signed-in user into the security context while a message is handled, so the
 * services see the real caller and never an anonymous one.
 */
@Component
@RequiredArgsConstructor
public class StompAuthChannelInterceptor implements ExecutorChannelInterceptor {

    private static final String BEARER = "Bearer ";
    private static final Pattern CONVERSATION_TOPIC =
            Pattern.compile("^/topic/conversations/(\\d+)(/read)?$");

    private final JwtProvider jwtProvider;
    private final ConversationRepository conversationRepository;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (accessor == null || accessor.getCommand() == null) {
            return message;
        }

        StompCommand command = accessor.getCommand();

        if (StompCommand.CONNECT.equals(command)) {
            accessor.setUser(authenticate(accessor.getFirstNativeHeader("Authorization")));
            return message;
        }

        if (StompCommand.SUBSCRIBE.equals(command)) {
            authorizeSubscription(accessor);
        } else if (StompCommand.SEND.equals(command) && accessor.getUser() == null) {
            throw new MessagingException("Authentication required");
        }
        return message;
    }

    @Override
    public Message<?> beforeHandle(Message<?> message, MessageChannel channel,
                                   org.springframework.messaging.MessageHandler handler) {
        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (accessor != null && accessor.getUser() instanceof UsernamePasswordAuthenticationToken auth) {
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
        return message;
    }

    @Override
    public void afterMessageHandled(Message<?> message, MessageChannel channel,
                                    org.springframework.messaging.MessageHandler handler, Exception ex) {
        SecurityContextHolder.clearContext();
    }

    private Principal authenticate(String header) {
        if (!StringUtils.hasText(header) || !header.startsWith(BEARER)) {
            throw new MessagingException("Authentication required");
        }
        String token = header.substring(BEARER.length()).trim();
        if (!jwtProvider.isValid(token)) {
            throw new MessagingException("Authentication required");
        }
        var authentication = new UsernamePasswordAuthenticationToken(
                jwtProvider.getUsername(token), null, jwtProvider.getAuthorities(token));
        // Keep the id on the session so SUBSCRIBE checks do not need the token again.
        authentication.setDetails(jwtProvider.getUserId(token));
        return authentication;
    }

    private void authorizeSubscription(StompHeaderAccessor accessor) {
        Principal user = accessor.getUser();
        if (user == null || !(user instanceof UsernamePasswordAuthenticationToken auth)) {
            throw new MessagingException("Authentication required");
        }

        String destination = accessor.getDestination();
        if (destination == null) {
            throw new MessagingException("Destination required");
        }

        // Per-user queues (error notices) are addressed by Spring to the right user only.
        if (destination.startsWith("/user/") || destination.startsWith("/queue/")) {
            return;
        }

        Matcher matcher = CONVERSATION_TOPIC.matcher(destination);
        if (!matcher.matches()) {
            throw new MessagingException("Subscription not allowed");
        }

        Long conversationId = Long.valueOf(matcher.group(1));
        if (!(auth.getDetails() instanceof Long userId)
                || !conversationRepository.isParticipant(conversationId, userId)) {
            throw new MessagingException("You are not a participant in this conversation");
        }
    }
}
