package com.messismo.bar.Exceptions;

public class ExistingComboNameFoundException extends Exception {

    public ExistingComboNameFoundException() {
        super();
    }

    public ExistingComboNameFoundException(String message) {
        super(message);
    }

    public ExistingComboNameFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
