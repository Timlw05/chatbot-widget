package com.azubi.chatbot.dto;

public class ChatRequestDto {
    private String message;
    private String imageBase64;
    private String imageMediaType;

    public String getMessage() { 
        return message; 
    }
    public void setMessage(String message) { 
        this.message = message; 
    }
    public String getImageBase64() { 
        return imageBase64; 
    }
    public void setImageBase64(String imageBase64) { 
        this.imageBase64 = imageBase64; 
    }
    public String getImageMediaType() { 
        return imageMediaType; 
    }
    public void setImageMediaType(String imageMediaType) { 
        this.imageMediaType = imageMediaType; 
    }
}
