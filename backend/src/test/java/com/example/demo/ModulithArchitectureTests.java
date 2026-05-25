package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.modulith.core.ApplicationModules;

class ModulithArchitectureTests {

    @Test
    void verifiesApplicationModuleBoundaries() {
        ApplicationModules.of(DemoApplication.class).verify();
    }
}