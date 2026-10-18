package com.khelp.job.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.khelp.common.exception.ApiException;
import java.util.List;
import org.junit.jupiter.api.Test;

class WorkDaysTest {

    @Test
    void ordersDaysFromMondayAndNormalisesCase() {
        assertEquals("MON,SAT,SUN", WorkDays.toStorage(List.of("sun", " SAT ", "mon")));
    }

    @Test
    void emptyOrEveryDayMeansFlexible() {
        assertNull(WorkDays.toStorage(null));
        assertNull(WorkDays.toStorage(List.of()));
        assertNull(WorkDays.toStorage(WorkDays.ALL));
    }

    @Test
    void rejectsUnknownDays() {
        assertThrows(ApiException.class, () -> WorkDays.toStorage(List.of("MON", "FUNDAY")));
    }

    @Test
    void readsStoredValueBackAsList() {
        assertEquals(List.of("SAT", "SUN"), WorkDays.fromStorage("SAT,SUN"));
        assertEquals(List.of(), WorkDays.fromStorage(null));
    }
}
