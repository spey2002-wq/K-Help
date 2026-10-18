package com.khelp.job.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;
import org.junit.jupiter.api.Test;

class JobSpecificationsTest {

    @Test
    void splitsSearchTextIntoWords() {
        assertEquals(List.of("cafe", "hongdae"), JobSpecifications.searchTerms("  cafe   hongdae "));
        assertEquals(List.of(), JobSpecifications.searchTerms("   "));
        assertEquals(List.of(), JobSpecifications.searchTerms(null));
    }

    @Test
    void capsNumberOfSearchWords() {
        assertEquals(6, JobSpecifications.searchTerms("a b c d e f g h i").size());
    }

    @Test
    void escapesLikeWildcards() {
        assertEquals("100\\%\\_off", JobSpecifications.escapeLike("100%_off"));
        assertEquals("a\\\\b", JobSpecifications.escapeLike("a\\b"));
    }
}
