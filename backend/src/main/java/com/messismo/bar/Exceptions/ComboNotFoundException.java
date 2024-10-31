package com.messismo.bar.Exceptions;

public class ComboNotFoundException extends Exception {
    public ComboNotFoundException() {
        super();
    }

    public ComboNotFoundException(String message) {
        super(message);
    }

    public ComboNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}


