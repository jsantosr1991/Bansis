import {
  RouterLink
} from "./chunk-IMONGHQ7.js";
import {
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵtext
} from "./chunk-KOB7DKR4.js";
import "./chunk-WYLQU5MV.js";

// src/app/shared/not-found/not-found.component.ts
var _c0 = () => ["/dashboard"];
var NotFoundComponent = class _NotFoundComponent {
  ngAfterViewInit() {
    particlesJS.load("particles-js", "/assets/vendor/particles/particles-config.json");
  }
  static \u0275fac = function NotFoundComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NotFoundComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NotFoundComponent, selectors: [["app-not-found"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 12, vars: 2, consts: [[1, "error-page"], ["id", "particles-js", 2, "position", "fixed", "width", "100%", "height", "100%", "z-index", "-1"], [1, "countdown-bg"], [1, "error-screen"], [1, "btn", "btn-outline-white", 3, "routerLink"]], template: function NotFoundComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275element(1, "div", 1)(2, "div", 2);
      \u0275\u0275elementStart(3, "div", 3)(4, "h1");
      \u0275\u0275text(5, "404");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "h5");
      \u0275\u0275text(7, "We're sorry but it looks");
      \u0275\u0275element(8, "br");
      \u0275\u0275text(9, "like that page doesn't exist anymore.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "a", 4);
      \u0275\u0275text(11, "Go back to Dashboard");
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(10);
      \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(1, _c0));
    }
  }, dependencies: [RouterLink], styles: ["\n\n.error-page[_ngcontent-%COMP%] {\n  position: relative;\n  min-height: 100vh;\n  background-color: #ff0000;\n  color: white;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  text-align: center;\n  padding: 2rem;\n  z-index: 0;\n}\n#particles-js[_ngcontent-%COMP%] {\n  position: fixed !important;\n  top: 0;\n  left: 0;\n  width: 100% !important;\n  height: 100% !important;\n  z-index: -1 !important;\n  background: transparent !important;\n}\n.countdown-bg[_ngcontent-%COMP%] {\n  display: none;\n}\n.error-screen[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n}\n/*# sourceMappingURL=not-found.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NotFoundComponent, { className: "NotFoundComponent", filePath: "src\\app\\shared\\not-found\\not-found.component.ts", lineNumber: 16 });
})();
export {
  NotFoundComponent
};
//# sourceMappingURL=chunk-OSO4AE3F.js.map
