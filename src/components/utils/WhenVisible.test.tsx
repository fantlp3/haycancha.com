import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { WhenVisible } from "./WhenVisible";

type ObserverCb = (entries: { isIntersecting: boolean }[]) => void;

function stubObserver() {
  const calls: { cb: ObserverCb; observed: Element[]; disconnected: boolean }[] = [];
  class Stub {
    observed: Element[] = [];
    disconnected = false;
    constructor(public cb: ObserverCb) {
      calls.push(this);
    }
    observe(el: Element) {
      this.observed.push(el);
    }
    disconnect() {
      this.disconnected = true;
    }
  }
  vi.stubGlobal("IntersectionObserver", Stub as unknown as typeof IntersectionObserver);
  return calls;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("WhenVisible", () => {
  it("muestra el placeholder y no los hijos hasta que interseca", () => {
    stubObserver();
    const { queryByText } = render(
      <WhenVisible placeholder={<span>cargando</span>}>
        <span>contenido pesado</span>
      </WhenVisible>
    );
    expect(queryByText("cargando")).not.toBeNull();
    expect(queryByText("contenido pesado")).toBeNull();
  });

  it("monta los hijos cuando el contenedor entra en viewport", () => {
    const observers = stubObserver();
    const { queryByText, rerender } = render(
      <WhenVisible placeholder={<span>cargando</span>}>
        <span>contenido pesado</span>
      </WhenVisible>
    );
    observers[0].cb([{ isIntersecting: true }]);
    rerender(
      <WhenVisible placeholder={<span>cargando</span>}>
        <span>contenido pesado</span>
      </WhenVisible>
    );
    expect(queryByText("contenido pesado")).not.toBeNull();
    expect(queryByText("cargando")).toBeNull();
    expect(observers[0].disconnected).toBe(true);
  });

  it("no monta nada si nunca interseca (panel oculto por CSS)", () => {
    const observers = stubObserver();
    const { queryByText, rerender } = render(
      <WhenVisible placeholder={<span>cargando</span>}>
        <span>contenido pesado</span>
      </WhenVisible>
    );
    observers[0].cb([{ isIntersecting: false }]);
    rerender(
      <WhenVisible placeholder={<span>cargando</span>}>
        <span>contenido pesado</span>
      </WhenVisible>
    );
    expect(queryByText("contenido pesado")).toBeNull();
  });

  it("sin IntersectionObserver monta directo", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const { queryByText } = render(
      <WhenVisible placeholder={<span>cargando</span>}>
        <span>contenido pesado</span>
      </WhenVisible>
    );
    expect(queryByText("contenido pesado")).not.toBeNull();
  });

  it("pasa className al contenedor para reservar el alto", () => {
    stubObserver();
    const { container } = render(
      <WhenVisible className="w-full h-full">
        <span>x</span>
      </WhenVisible>
    );
    expect(container.firstElementChild?.className).toBe("w-full h-full");
  });
});
