package com.khelp.config;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CachingConfigurer;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * Redis cache setup. Values are JSON-serialized so cached payloads stay
 * human-readable in redis-cli and survive application restarts.
 */
@Configuration
@RequiredArgsConstructor
public class CacheConfig implements CachingConfigurer {

    private final RedisConnectionFactory connectionFactory;

    @Bean
    public CacheManager cacheManager() {
        // Default typing lets the cache round-trip DTOs polymorphically; JavaTimeModule
        // is required because DTOs carry java.time.Instant audit timestamps.
        ObjectMapper cacheMapper = JsonMapper.builder()
                .addModule(new JavaTimeModule())
                .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
                .build();
        cacheMapper.activateDefaultTyping(
                cacheMapper.getPolymorphicTypeValidator(),
                ObjectMapper.DefaultTyping.EVERYTHING,
                JsonTypeInfo.As.PROPERTY);
        GenericJackson2JsonRedisSerializer valueSerializer =
                new GenericJackson2JsonRedisSerializer(cacheMapper);

        RedisCacheConfiguration defaults = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(java.time.Duration.ofMinutes(10))
                .disableCachingNullValues()
                .serializeKeysWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(valueSerializer));

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaults)
                .withCacheConfiguration("guides",
                        defaults.entryTtl(java.time.Duration.ofMinutes(30)))
                .withCacheConfiguration("jobs",
                        defaults.entryTtl(java.time.Duration.ofMinutes(5)))
                .withCacheConfiguration("housing",
                        defaults.entryTtl(java.time.Duration.ofMinutes(5)))
                .build();
    }

    @Override
    public KeyGenerator keyGenerator() {
        return (target, method, params) -> {
            StringBuilder key = new StringBuilder(target.getClass().getSimpleName())
                    .append(".").append(method.getName());
            for (Object param : params) {
                key.append(":").append(param == null ? "null" : param.toString());
            }
            return key.toString();
        };
    }
}
