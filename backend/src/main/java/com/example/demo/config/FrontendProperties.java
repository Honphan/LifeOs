package com.example.demo.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.frontend")
public class FrontendProperties {

    private String url = "http://localhost:5173";
    private String oauthSuccessPath = "/dashboard";

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getOauthSuccessPath() {
        return oauthSuccessPath;
    }

    public void setOauthSuccessPath(String oauthSuccessPath) {
        this.oauthSuccessPath = oauthSuccessPath;
    }
}
