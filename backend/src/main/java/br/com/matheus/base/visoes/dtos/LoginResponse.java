package br.com.matheus.base.visoes.dtos;

public record LoginResponse(String token, String refreshToken, String email, String nome) {
}
