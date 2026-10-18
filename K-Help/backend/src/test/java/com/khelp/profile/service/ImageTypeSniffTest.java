package com.khelp.profile.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Test;

class ImageTypeSniffTest {

    @Test
    void recognisesRealImageSignatures() {
        assertEquals("image/jpeg",
                ProfileService.sniffImageType(new byte[] {(byte) 0xFF, (byte) 0xD8, (byte) 0xFF, (byte) 0xE0, 0, 0}));
        assertEquals("image/png",
                ProfileService.sniffImageType(new byte[] {(byte) 0x89, 'P', 'N', 'G', 0x0D, 0x0A, 0x1A, 0x0A, 0}));
        assertEquals("image/gif", ProfileService.sniffImageType("GIF89a".getBytes(StandardCharsets.US_ASCII)));
        assertEquals("image/webp",
                ProfileService.sniffImageType("RIFF....WEBPVP8 ".getBytes(StandardCharsets.US_ASCII)));
    }

    @Test
    void rejectsNonImages() {
        assertNull(ProfileService.sniffImageType("<html><script>alert(1)</script></html>"
                .getBytes(StandardCharsets.UTF_8)));
        assertNull(ProfileService.sniffImageType("%PDF-1.7".getBytes(StandardCharsets.US_ASCII)));
        assertNull(ProfileService.sniffImageType(new byte[0]));
        // RIFF container that is not WebP (e.g. WAV)
        assertNull(ProfileService.sniffImageType("RIFF....WAVEfmt ".getBytes(StandardCharsets.US_ASCII)));
    }
}
