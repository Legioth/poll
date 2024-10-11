package org.vaadin.leif;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import com.vaadin.hilla.signals.NumberSignal;

@BrowserCallable
@AnonymousAllowed
public class VoteService {
    private Map<String, NumberSignal> options = new ConcurrentHashMap<>();

    public NumberSignal get(String name) {
        return options.computeIfAbsent(name, (ignore) -> new NumberSignal());
    }
}
