package org.vaadin.leif;

import java.util.Map;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import com.vaadin.hilla.signals.NumberSignal;

@BrowserCallable
@AnonymousAllowed
public class VoteService1 {
    private final Map<String, NumberSignal> options = Map.of(
            "Vaadin", new NumberSignal(5d),
            "React", new NumberSignal(2d),
            "Angular", new NumberSignal(1d));

    public NumberSignal get(String name) {
        return options.get(name);
    }
}
