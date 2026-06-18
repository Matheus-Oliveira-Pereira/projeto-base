package br.com.matheus.base.enums;

import org.springframework.security.core.GrantedAuthority;

public enum Role implements GrantedAuthority {
    USRA,
    USRB,
    USRC,
    USRD,
    PRFA,
    PRFB,
    PRFC,
    PRFD;

    @Override
    public String getAuthority() {
        return "ROLE_" + name();
    }
}
