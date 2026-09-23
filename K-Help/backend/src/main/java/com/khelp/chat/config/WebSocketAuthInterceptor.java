package com.khelp.chat.config;

import com.khelp.security.JwtProvider;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.util.StringUtils;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * Authenticates STOMP CONNECT frames using the same JWT as the REST API.
 *
 * <p>Implemented as an inbound channel interceptor so it runs inside the existing
 * WebSocket broker configuration without a second {@code @EnableWebSocketMessageBroker}.
 */
@Configuration
@Order(Ordered.HIGHEST_PRECEDENCE + 99)
@RequiredArgsConstructor
public class WebSocketAuthInterceptor implements WebSocketMessageBrokerConfigurer {

    private final JwtProvider jwtProvider;

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor =
                        MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                if (accessor == null || !StompCommand.CONNECT.equals(accessor.getCommand())) {
                    return message;
                }

                String token = resolveToken(accessor);
                if (token != null && jwtProvider.isValid(token)) {
                    accessor.setUser(new UsernamePasswordAuthenticationToken(
                            jwtProvider.getUsername(token),
                            null,
                            List.of(new SimpleGrantedAuthority(
                                    "ROLE_" + jwtProvider.getAuthorities(token)
                                            .getFirst()
                                            .getAuthority()
                                            .replace("ROLE_", "")))));
                }

                return message;
            }
        });
    }

    private String resolveToken(StompHeaderAccessor accessor) {
        String header = accessor.getFirstNativeHeader("Authorization");
        if (!StringUtils.hasText(header)) {
            header = accessor.getFirstNativeHeader("authorization");
        }
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            return header.substring(7).trim();
        }
        return null;
    }
}
