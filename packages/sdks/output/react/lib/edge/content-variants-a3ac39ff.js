import { jsx as f, jsxs as P, Fragment as K } from "react/jsx-runtime";
import { lazy as h, useRef as ne, useState as k, useEffect as I } from "react";
import { isBrowser as U, TARGET as Q, isEditing as A, setupBrowserForEditing as ae, createRegisterComponentMessage as ie, getDefaultCanTrack as W, _track as _, isPreviewing as oe, fetchOneEntry as re, logger as se, createEditorListener as le, fetch as de, fastClone as ce, serializeComponentInfo as B, handleABTestingSync as ue } from "./server-entry-df819e6c.js";
import { Columns as me, Symbol as pe, Text as ge } from "./blocks-exports.mjs";
import { builderContext as fe, triggerAnimation as he, evaluate as M, InlinedStyles as G, ComponentsContext as be, Blocks as ye } from "./blocks-83caba33.js";
import "./get-class-prop-name-775bd8d0.js";
const xe = {
  name: "Core:Button",
  image: "https://cdn.builder.io/api/v1/image/assets%2FIsxPKMo2gPRRKeakUztj1D6uqed2%2F81a15681c3e74df09677dfc57a615b13",
  defaultStyles: {
    // TODO: make min width more intuitive and set one
    appearance: "none",
    paddingTop: "15px",
    paddingBottom: "15px",
    paddingLeft: "25px",
    paddingRight: "25px",
    backgroundColor: "#000000",
    color: "white",
    borderRadius: "4px",
    textAlign: "center",
    cursor: "pointer"
  },
  inputs: [{
    name: "text",
    type: "text",
    defaultValue: "Click me!",
    bubble: !0
  }, {
    name: "link",
    type: "url",
    bubble: !0
  }, {
    name: "openLinkInNewTab",
    type: "boolean",
    defaultValue: !1,
    friendlyName: "Open link in new tab"
  }],
  static: !0,
  noWrap: !0
}, ve = h(() => import("./button-fe90ee85.js")), Se = {
  // TODO: ways to statically preprocess JSON for references, functions, etc
  name: "Columns",
  isRSC: !0,
  inputs: [{
    name: "columns",
    type: "array",
    broadcast: !0,
    subFields: [{
      name: "blocks",
      type: "array",
      hideFromUI: !0,
      defaultValue: [{
        "@type": "@builder.io/sdk:Element",
        responsiveStyles: {
          large: {
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            flexShrink: "0",
            position: "relative",
            marginTop: "30px",
            textAlign: "center",
            lineHeight: "normal",
            height: "auto",
            minHeight: "20px",
            minWidth: "20px",
            overflow: "hidden"
          }
        },
        component: {
          name: "Image",
          options: {
            image: "https://builder.io/api/v1/image/assets%2Fpwgjf0RoYWbdnJSbpBAjXNRMe9F2%2Ffb27a7c790324294af8be1c35fe30f4d",
            backgroundPosition: "center",
            backgroundSize: "cover",
            aspectRatio: 0.7004048582995948
          }
        }
      }, {
        "@type": "@builder.io/sdk:Element",
        responsiveStyles: {
          large: {
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            flexShrink: "0",
            position: "relative",
            marginTop: "30px",
            textAlign: "center",
            lineHeight: "normal",
            height: "auto"
          }
        },
        component: {
          name: "Text",
          options: {
            text: "<p>Enter some text...</p>"
          }
        }
      }]
    }, {
      name: "width",
      type: "number",
      hideFromUI: !0,
      helperText: "Width %, e.g. set to 50 to fill half of the space"
    }, {
      name: "link",
      type: "url",
      helperText: "Optionally set a url that clicking this column will link to"
    }],
    defaultValue: [{
      blocks: [{
        "@type": "@builder.io/sdk:Element",
        responsiveStyles: {
          large: {
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            flexShrink: "0",
            position: "relative",
            marginTop: "30px",
            textAlign: "center",
            lineHeight: "normal",
            height: "auto",
            minHeight: "20px",
            minWidth: "20px",
            overflow: "hidden"
          }
        },
        component: {
          name: "Image",
          options: {
            image: "https://builder.io/api/v1/image/assets%2Fpwgjf0RoYWbdnJSbpBAjXNRMe9F2%2Ffb27a7c790324294af8be1c35fe30f4d",
            backgroundPosition: "center",
            backgroundSize: "cover",
            aspectRatio: 0.7004048582995948
          }
        }
      }, {
        "@type": "@builder.io/sdk:Element",
        responsiveStyles: {
          large: {
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            flexShrink: "0",
            position: "relative",
            marginTop: "30px",
            textAlign: "center",
            lineHeight: "normal",
            height: "auto"
          }
        },
        component: {
          name: "Text",
          options: {
            text: "<p>Enter some text...</p>"
          }
        }
      }]
    }, {
      blocks: [{
        "@type": "@builder.io/sdk:Element",
        responsiveStyles: {
          large: {
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            flexShrink: "0",
            position: "relative",
            marginTop: "30px",
            textAlign: "center",
            lineHeight: "normal",
            height: "auto",
            minHeight: "20px",
            minWidth: "20px",
            overflow: "hidden"
          }
        },
        component: {
          name: "Image",
          options: {
            image: "https://builder.io/api/v1/image/assets%2Fpwgjf0RoYWbdnJSbpBAjXNRMe9F2%2Ffb27a7c790324294af8be1c35fe30f4d",
            backgroundPosition: "center",
            backgroundSize: "cover",
            aspectRatio: 0.7004048582995948
          }
        }
      }, {
        "@type": "@builder.io/sdk:Element",
        responsiveStyles: {
          large: {
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            flexShrink: "0",
            position: "relative",
            marginTop: "30px",
            textAlign: "center",
            lineHeight: "normal",
            height: "auto"
          }
        },
        component: {
          name: "Text",
          options: {
            text: "<p>Enter some text...</p>"
          }
        }
      }]
    }],
    onChange: (e) => {
      function t() {
        n.forEach((a) => {
          a.delete("width");
        });
      }
      const n = e.get("columns");
      Array.isArray(n) && n.find((d) => d.get("width")) && (n.find((p) => !p.get("width")) || n.reduce((o, u) => o + u.get("width"), 0) !== 100) && t();
    }
  }, {
    name: "space",
    type: "number",
    defaultValue: 20,
    helperText: "Size of gap between columns",
    advanced: !0
  }, {
    name: "stackColumnsAt",
    type: "string",
    defaultValue: "tablet",
    helperText: "Convert horizontal columns to vertical at what device size",
    enum: ["tablet", "mobile", "never"],
    advanced: !0
  }, {
    name: "reverseColumnsWhenStacked",
    type: "boolean",
    defaultValue: !1,
    helperText: "When stacking columns for mobile devices, reverse the ordering",
    advanced: !0
  }]
}, Ie = {
  name: "Fragment",
  static: !0,
  hidden: !0,
  canHaveChildren: !0,
  noWrap: !0
}, ke = h(() => import("./fragment-1492bc7f.js")), Te = {
  name: "Image",
  static: !0,
  image: "https://firebasestorage.googleapis.com/v0/b/builder-3b0a2.appspot.com/o/images%2Fbaseline-insert_photo-24px.svg?alt=media&token=4e5d0ef4-f5e8-4e57-b3a9-38d63a9b9dc4",
  defaultStyles: {
    position: "relative",
    minHeight: "20px",
    minWidth: "20px",
    overflow: "hidden"
  },
  canHaveChildren: !0,
  inputs: [{
    name: "image",
    type: "file",
    bubble: !0,
    allowedFileTypes: ["jpeg", "jpg", "png", "svg"],
    required: !0,
    defaultValue: "https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F72c80f114dc149019051b6852a9e3b7a",
    onChange: (e) => {
      e.delete("srcset"), e.delete("noWebp");
      function n(i, o = 6e4) {
        return new Promise((u, S) => {
          const y = document.createElement("img");
          let w = !1;
          y.onload = () => {
            w = !0, u(y);
          }, y.addEventListener("error", (T) => {
            console.warn("Image load failed", T.error), S(T.error);
          }), y.src = i, setTimeout(() => {
            w || S(new Error("Image load timed out"));
          }, o);
        });
      }
      function a(i) {
        return Math.round(i * 1e3) / 1e3;
      }
      const d = e.get("image"), p = e.get("aspectRatio");
      if (fetch(d).then((i) => i.blob()).then((i) => {
        i.type.includes("svg") && e.set("noWebp", !0);
      }), d && (!p || p === 0.7041))
        return n(d).then((i) => {
          const o = e.get("aspectRatio");
          e.get("image") === d && (!o || o === 0.7041) && i.width && i.height && (e.set("aspectRatio", a(i.height / i.width)), e.set("height", i.height), e.set("width", i.width));
        });
    }
  }, {
    name: "backgroundSize",
    type: "text",
    defaultValue: "cover",
    enum: [{
      label: "contain",
      value: "contain",
      helperText: "The image should never get cropped"
    }, {
      label: "cover",
      value: "cover",
      helperText: "The image should fill it's box, cropping when needed"
    }]
  }, {
    name: "backgroundPosition",
    type: "text",
    defaultValue: "center",
    enum: ["center", "top", "left", "right", "bottom", "top left", "top right", "bottom left", "bottom right"]
  }, {
    name: "altText",
    type: "string",
    helperText: "Text to display when the user has images off"
  }, {
    name: "height",
    type: "number",
    hideFromUI: !0
  }, {
    name: "width",
    type: "number",
    hideFromUI: !0
  }, {
    name: "sizes",
    type: "string",
    hideFromUI: !0
  }, {
    name: "srcset",
    type: "string",
    hideFromUI: !0
  }, {
    name: "lazy",
    type: "boolean",
    defaultValue: !0,
    hideFromUI: !0
  }, {
    name: "fitContent",
    type: "boolean",
    helperText: "When child blocks are provided, fit to them instead of using the image's aspect ratio",
    defaultValue: !0
  }, {
    name: "aspectRatio",
    type: "number",
    helperText: "This is the ratio of height/width, e.g. set to 1.5 for a 300px wide and 200px tall photo. Set to 0 to not force the image to maintain it's aspect ratio",
    advanced: !0,
    defaultValue: 0.7041
  }]
}, Ce = h(() => import("./image-0008c792.js")), we = {
  name: "Core:Section",
  static: !0,
  image: "https://cdn.builder.io/api/v1/image/assets%2FIsxPKMo2gPRRKeakUztj1D6uqed2%2F682efef23ace49afac61748dd305c70a",
  inputs: [{
    name: "maxWidth",
    type: "number",
    defaultValue: 1200
  }, {
    name: "lazyLoad",
    type: "boolean",
    defaultValue: !1,
    advanced: !0,
    description: "Only render this section when in view"
  }],
  defaultStyles: {
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingTop: "50px",
    paddingBottom: "50px",
    marginTop: "0px",
    width: "100vw",
    marginLeft: "calc(50% - 50vw)"
  },
  canHaveChildren: !0,
  defaultChildren: [{
    "@type": "@builder.io/sdk:Element",
    responsiveStyles: {
      large: {
        textAlign: "center"
      }
    },
    component: {
      name: "Text",
      options: {
        text: "<p><b>I am a section! My content keeps from getting too wide, so that it's easy to read even on big screens.</b></p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur</p>"
      }
    }
  }]
}, Ve = h(() => import("./section-d83e2dd3.js")), Re = {
  name: "Slot",
  isRSC: !0,
  description: "Allow child blocks to be inserted into this content when used as a Symbol",
  docsLink: "https://www.builder.io/c/docs/symbols-with-blocks",
  image: "https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F3aad6de36eae43b59b52c85190fdef56",
  // Maybe wrap this for canHaveChildren so bind children to this hm
  inputs: [{
    name: "name",
    type: "string",
    required: !0,
    defaultValue: "children"
  }]
}, Ee = h(() => import("./slot-533f4d8f.js")), Fe = {
  name: "Symbol",
  noWrap: !0,
  static: !0,
  isRSC: !0,
  inputs: [{
    name: "symbol",
    type: "uiSymbol"
  }, {
    name: "dataOnly",
    helperText: "Make this a data symbol that doesn't display any UI",
    type: "boolean",
    defaultValue: !1,
    advanced: !0,
    hideFromUI: !0
  }, {
    name: "inheritState",
    helperText: "Inherit the parent component state and data",
    type: "boolean",
    defaultValue: !1,
    advanced: !0
  }, {
    name: "renderToLiquid",
    helperText: "Render this symbols contents to liquid. Turn off to fetch with javascript and use custom targeting",
    type: "boolean",
    defaultValue: !1,
    advanced: !0,
    hideFromUI: !0
  }, {
    name: "useChildren",
    hideFromUI: !0,
    type: "boolean"
  }]
}, We = {
  name: "Text",
  static: !0,
  isRSC: !0,
  image: "https://firebasestorage.googleapis.com/v0/b/builder-3b0a2.appspot.com/o/images%2Fbaseline-text_fields-24px%20(1).svg?alt=media&token=12177b73-0ee3-42ca-98c6-0dd003de1929",
  inputs: [{
    name: "text",
    type: "html",
    required: !0,
    autoFocus: !0,
    bubble: !0,
    defaultValue: "Enter some text..."
  }],
  defaultStyles: {
    lineHeight: "normal",
    height: "auto",
    textAlign: "center"
  }
}, Ae = {
  name: "Custom Code",
  static: !0,
  requiredPermissions: ["editCode"],
  inputs: [{
    name: "code",
    type: "html",
    required: !0,
    defaultValue: "<p>Hello there, I am custom HTML code!</p>",
    code: !0
  }, {
    name: "replaceNodes",
    type: "boolean",
    helperText: "Preserve server rendered dom nodes",
    advanced: !0
  }, {
    name: "scriptsClientOnly",
    type: "boolean",
    defaultValue: !1,
    helperText: "Only print and run scripts on the client. Important when scripts influence DOM that could be replaced when client loads",
    advanced: !0
  }]
}, Pe = h(() => import("./custom-code-7786788e.js")), Ue = {
  name: "Embed",
  static: !0,
  inputs: [{
    name: "url",
    type: "url",
    required: !0,
    defaultValue: "",
    helperText: "e.g. enter a youtube url, google map, etc",
    onChange: (e) => {
      const t = e.get("url");
      if (t)
        return e.set("content", "Loading..."), fetch(`https://iframe.ly/api/iframely?url=${t}&api_key=ae0e60e78201a3f2b0de4b`).then((a) => a.json()).then((a) => {
          e.get("url") === t && (a.html ? e.set("content", a.html) : e.set("content", "Invalid url, please try another"));
        }).catch((a) => {
          e.set("content", "There was an error embedding this URL, please try again or another URL");
        });
      e.delete("content");
    }
  }, {
    name: "content",
    type: "html",
    defaultValue: '<div style="padding: 20px; text-align: center">(Choose an embed URL)<div>',
    hideFromUI: !0
  }]
}, $e = h(() => import("./embed-5c1bbe12.js")), He = {
  name: "Form:Form",
  // editableTags: ['builder-form-error']
  defaults: {
    responsiveStyles: {
      large: {
        marginTop: "15px",
        paddingBottom: "15px"
      }
    }
  },
  image: "https://cdn.builder.io/api/v1/image/assets%2FIsxPKMo2gPRRKeakUztj1D6uqed2%2Fef36d2a846134910b64b88e6d18c5ca5",
  inputs: [{
    name: "sendSubmissionsTo",
    type: "string",
    // TODO: save to builder data and user can download as csv
    // TODO: easy for mode too or computed add/remove fields form mode
    // so you can edit details and high level mode at same time...
    // Later - more integrations like mailchimp
    // /api/v1/form-submit?to=mailchimp
    enum: [{
      label: "Send to email",
      value: "email",
      helperText: "Send form submissions to the email address of your choosing"
    }, {
      label: "Custom",
      value: "custom",
      helperText: "Handle where the form requests go manually with a little code, e.g. to your own custom backend"
    }],
    defaultValue: "email"
  }, {
    name: "sendSubmissionsToEmail",
    type: "string",
    required: !0,
    // TODO: required: () => options.get("sendSubmissionsTo") === "email"
    defaultValue: "your@email.com",
    showIf: 'options.get("sendSubmissionsTo") === "email"'
  }, {
    name: "sendWithJs",
    type: "boolean",
    helperText: "Set to false to use basic html form action",
    defaultValue: !0,
    showIf: 'options.get("sendSubmissionsTo") === "custom"'
  }, {
    name: "name",
    type: "string",
    defaultValue: "My form"
    // advanced: true
  }, {
    name: "action",
    type: "string",
    helperText: "URL to send the form data to",
    showIf: 'options.get("sendSubmissionsTo") === "custom"'
  }, {
    name: "contentType",
    type: "string",
    defaultValue: "application/json",
    advanced: !0,
    // TODO: do automatically if file input
    enum: ["application/json", "multipart/form-data", "application/x-www-form-urlencoded"],
    showIf: 'options.get("sendSubmissionsTo") === "custom" && options.get("sendWithJs") === true'
  }, {
    name: "method",
    type: "string",
    showIf: 'options.get("sendSubmissionsTo") === "custom"',
    defaultValue: "POST",
    advanced: !0
  }, {
    name: "previewState",
    type: "string",
    // TODO: persist: false flag
    enum: ["unsubmitted", "sending", "success", "error"],
    defaultValue: "unsubmitted",
    helperText: 'Choose a state to edit, e.g. choose "success" to show what users see on success and edit the message',
    showIf: 'options.get("sendSubmissionsTo") !== "zapier" && options.get("sendWithJs") === true'
  }, {
    name: "successUrl",
    type: "url",
    helperText: "Optional URL to redirect the user to on form submission success",
    showIf: 'options.get("sendSubmissionsTo") !== "zapier" && options.get("sendWithJs") === true'
  }, {
    name: "resetFormOnSubmit",
    type: "boolean",
    showIf: "options.get('sendSubmissionsTo') === 'custom' && options.get('sendWithJs') === true",
    advanced: !0
  }, {
    name: "successMessage",
    type: "uiBlocks",
    hideFromUI: !0,
    defaultValue: [{
      "@type": "@builder.io/sdk:Element",
      responsiveStyles: {
        large: {
          marginTop: "10px"
        }
      },
      component: {
        name: "Text",
        options: {
          text: "<span>Thanks!</span>"
        }
      }
    }]
  }, {
    name: "validate",
    type: "boolean",
    defaultValue: !0,
    advanced: !0
  }, {
    name: "errorMessagePath",
    type: "text",
    advanced: !0,
    helperText: 'Path to where to get the error message from in a JSON response to display to the user, e.g. "error.message" for a response like { "error": { "message": "this username is taken" }}'
  }, {
    name: "errorMessage",
    type: "uiBlocks",
    hideFromUI: !0,
    defaultValue: [{
      "@type": "@builder.io/sdk:Element",
      responsiveStyles: {
        large: {
          marginTop: "10px"
        }
      },
      bindings: {
        "component.options.text": "state.formErrorMessage || block.component.options.text"
      },
      component: {
        name: "Text",
        options: {
          text: "<span>Form submission error :( Please check your answers and try again</span>"
        }
      }
    }]
  }, {
    name: "sendingMessage",
    type: "uiBlocks",
    hideFromUI: !0,
    defaultValue: [{
      "@type": "@builder.io/sdk:Element",
      responsiveStyles: {
        large: {
          marginTop: "10px"
        }
      },
      component: {
        name: "Text",
        options: {
          text: "<span>Sending...</span>"
        }
      }
    }]
  }, {
    name: "customHeaders",
    type: "map",
    valueType: {
      type: "string"
    },
    advanced: !0,
    showIf: 'options.get("sendSubmissionsTo") === "custom" && options.get("sendWithJs") === true'
  }],
  noWrap: !0,
  canHaveChildren: !0,
  defaultChildren: [{
    "@type": "@builder.io/sdk:Element",
    responsiveStyles: {
      large: {
        marginTop: "10px"
      }
    },
    component: {
      name: "Text",
      options: {
        text: "<span>Enter your name</span>"
      }
    }
  }, {
    "@type": "@builder.io/sdk:Element",
    responsiveStyles: {
      large: {
        marginTop: "10px"
      }
    },
    component: {
      name: "Form:Input",
      options: {
        name: "name",
        placeholder: "Jane Doe"
      }
    }
  }, {
    "@type": "@builder.io/sdk:Element",
    responsiveStyles: {
      large: {
        marginTop: "10px"
      }
    },
    component: {
      name: "Text",
      options: {
        text: "<span>Enter your email</span>"
      }
    }
  }, {
    "@type": "@builder.io/sdk:Element",
    responsiveStyles: {
      large: {
        marginTop: "10px"
      }
    },
    component: {
      name: "Form:Input",
      options: {
        name: "email",
        placeholder: "jane@doe.com"
      }
    }
  }, {
    "@type": "@builder.io/sdk:Element",
    responsiveStyles: {
      large: {
        marginTop: "10px"
      }
    },
    component: {
      name: "Form:SubmitButton",
      options: {
        text: "Submit"
      }
    }
  }]
}, De = h(() => import("./form-d7925710.js")), Le = {
  name: "Form:Input",
  image: "https://cdn.builder.io/api/v1/image/assets%2FIsxPKMo2gPRRKeakUztj1D6uqed2%2Fad6f37889d9e40bbbbc72cdb5875d6ca",
  inputs: [
    {
      name: "type",
      type: "text",
      enum: ["text", "number", "email", "url", "checkbox", "radio", "range", "date", "datetime-local", "search", "tel", "time", "file", "month", "week", "password", "color", "hidden"],
      defaultValue: "text"
    },
    {
      name: "name",
      type: "string",
      required: !0,
      helperText: 'Every input in a form needs a unique name describing what it takes, e.g. "email"'
    },
    {
      name: "placeholder",
      type: "string",
      defaultValue: "Hello there",
      helperText: "Text to display when there is no value"
    },
    // TODO: handle value vs default value automatically like ng-model
    {
      name: "defaultValue",
      type: "string"
    },
    {
      name: "value",
      type: "string",
      advanced: !0
    },
    {
      name: "required",
      type: "boolean",
      helperText: "Is this input required to be filled out to submit a form",
      defaultValue: !1
    }
  ],
  noWrap: !0,
  static: !0,
  defaultStyles: {
    paddingTop: "10px",
    paddingBottom: "10px",
    paddingLeft: "10px",
    paddingRight: "10px",
    borderRadius: "3px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#ccc"
  }
}, qe = h(() => import("./input-206d0dac.js")), Ne = {
  name: "Form:Select",
  image: "https://cdn.builder.io/api/v1/image/assets%2FIsxPKMo2gPRRKeakUztj1D6uqed2%2F83acca093fb24aaf94dee136e9a4b045",
  defaultStyles: {
    alignSelf: "flex-start"
  },
  inputs: [{
    name: "options",
    type: "list",
    required: !0,
    subFields: [{
      name: "value",
      type: "text",
      required: !0
    }, {
      name: "name",
      type: "text"
    }],
    defaultValue: [{
      value: "option 1"
    }, {
      value: "option 2"
    }]
  }, {
    name: "name",
    type: "string",
    required: !0,
    helperText: 'Every select in a form needs a unique name describing what it gets, e.g. "email"'
  }, {
    name: "defaultValue",
    type: "string"
  }, {
    name: "value",
    type: "string",
    advanced: !0
  }, {
    name: "required",
    type: "boolean",
    defaultValue: !1
  }],
  static: !0,
  noWrap: !0
}, je = h(() => import("./select-7b925a77.js")), Ke = {
  name: "Form:SubmitButton",
  image: "https://cdn.builder.io/api/v1/image/assets%2FIsxPKMo2gPRRKeakUztj1D6uqed2%2Fdf2820ffed1f4349a94c40b3221f5b98",
  defaultStyles: {
    appearance: "none",
    paddingTop: "15px",
    paddingBottom: "15px",
    paddingLeft: "25px",
    paddingRight: "25px",
    backgroundColor: "#3898EC",
    color: "white",
    borderRadius: "4px",
    cursor: "pointer"
  },
  inputs: [{
    name: "text",
    type: "text",
    defaultValue: "Click me"
  }],
  static: !0,
  noWrap: !0
  // TODO: optional children? maybe as optional form input
  // that only shows if advanced setting is flipped
  // TODO: defaultChildren
  // canHaveChildren: true,
}, _e = h(() => import("./submit-button-b48361a7.js")), Be = {
  // friendlyName?
  name: "Raw:Img",
  hideFromInsertMenu: !0,
  image: "https://firebasestorage.googleapis.com/v0/b/builder-3b0a2.appspot.com/o/images%2Fbaseline-insert_photo-24px.svg?alt=media&token=4e5d0ef4-f5e8-4e57-b3a9-38d63a9b9dc4",
  inputs: [{
    name: "image",
    bubble: !0,
    type: "file",
    allowedFileTypes: ["jpeg", "jpg", "png", "svg", "gif", "webp"],
    required: !0
  }],
  noWrap: !0,
  static: !0
}, Me = h(() => import("./img-ab5afe21.js")), Oe = {
  name: "Video",
  canHaveChildren: !0,
  defaultStyles: {
    minHeight: "20px",
    minWidth: "20px"
  },
  image: "https://firebasestorage.googleapis.com/v0/b/builder-3b0a2.appspot.com/o/images%2Fbaseline-videocam-24px%20(1).svg?alt=media&token=49a84e4a-b20e-4977-a650-047f986874bb",
  inputs: [{
    name: "video",
    type: "file",
    allowedFileTypes: ["mp4"],
    bubble: !0,
    defaultValue: "https://cdn.builder.io/o/assets%2FYJIGb4i01jvw0SRdL5Bt%2Fd27731a526464deba0016216f5f9e570%2Fcompressed?apiKey=YJIGb4i01jvw0SRdL5Bt&token=d27731a526464deba0016216f5f9e570&alt=media&optimized=true",
    required: !0
  }, {
    name: "posterImage",
    type: "file",
    allowedFileTypes: ["jpeg", "png"],
    helperText: "Image to show before the video plays"
  }, {
    name: "autoPlay",
    type: "boolean",
    defaultValue: !0
  }, {
    name: "controls",
    type: "boolean",
    defaultValue: !1
  }, {
    name: "muted",
    type: "boolean",
    defaultValue: !0
  }, {
    name: "loop",
    type: "boolean",
    defaultValue: !0
  }, {
    name: "playsInline",
    type: "boolean",
    defaultValue: !0
  }, {
    name: "fit",
    type: "text",
    defaultValue: "cover",
    enum: ["contain", "cover", "fill", "auto"]
  }, {
    name: "preload",
    type: "text",
    defaultValue: "metadata",
    enum: ["auto", "metadata", "none"]
  }, {
    name: "fitContent",
    type: "boolean",
    helperText: "When child blocks are provided, fit to them instead of using the aspect ratio",
    defaultValue: !0,
    advanced: !0
  }, {
    name: "position",
    type: "text",
    defaultValue: "center",
    enum: ["center", "top", "left", "right", "bottom", "top left", "top right", "bottom left", "bottom right"]
  }, {
    name: "height",
    type: "number",
    advanced: !0
  }, {
    name: "width",
    type: "number",
    advanced: !0
  }, {
    name: "aspectRatio",
    type: "number",
    advanced: !0,
    defaultValue: 0.7004048582995948
  }, {
    name: "lazyLoad",
    type: "boolean",
    helperText: 'Load this video "lazily" - as in only when a user scrolls near the video. Recommended for optmized performance and bandwidth consumption',
    defaultValue: !0,
    advanced: !0
  }]
}, ze = h(() => import("./video-58c2cc8d.js")), Je = () => [{
  component: Pe,
  ...Ae
}, {
  component: $e,
  ...Ue
}, {
  component: De,
  ...He
}, {
  component: qe,
  ...Le
}, {
  component: _e,
  ...Ke
}, {
  component: je,
  ...Ne
}, {
  component: Me,
  ...Be
}, {
  component: ze,
  ...Oe
}], O = () => [{
  component: ve,
  ...xe
}, {
  component: me,
  ...Se
}, {
  component: ke,
  ...Ie
}, {
  component: Ce,
  ...Te
}, {
  component: Ve,
  ...we
}, {
  component: Ee,
  ...Re
}, {
  component: pe,
  ...Fe
}, {
  component: ge,
  ...We
}, ...Je()], Ye = `function updateCookiesAndStyles(contentId, variants, isHydrationTarget) {
  function getAndSetVariantId() {
    function setCookie(name, value, days) {
      let expires = '';
      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = '; expires=' + date.toUTCString();
      }
      document.cookie = name + '=' + (value || '') + expires + '; path=/' + '; Secure; SameSite=None';
    }
    function getCookie(name) {
      const nameEQ = name + '=';
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    }
    const cookieName = \`builder.tests.\${contentId}\`;
    const variantInCookie = getCookie(cookieName);
    const availableIDs = variants.map(vr => vr.id).concat(contentId);
    if (variantInCookie && availableIDs.includes(variantInCookie)) {
      return variantInCookie;
    }
    let n = 0;
    const random = Math.random();
    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];
      const testRatio = variant.testRatio;
      n += testRatio;
      if (random < n) {
        setCookie(cookieName, variant.id);
        return variant.id;
      }
    }
    setCookie(cookieName, contentId);
    return contentId;
  }
  const winningVariantId = getAndSetVariantId();
  const styleEl = document.currentScript?.previousElementSibling;
  if (isHydrationTarget) {
    styleEl.remove();
    const thisScriptEl = document.currentScript;
    thisScriptEl?.remove();
  } else {
    const newStyleStr = variants.concat({
      id: contentId
    }).filter(variant => variant.id !== winningVariantId).map(value => {
      return \`.variant-\${value.id} {  display: none; }
        \`;
    }).join('');
    styleEl.innerHTML = newStyleStr;
  }
}`, Qe = `function updateVariantVisibility(variantContentId, defaultContentId, isHydrationTarget) {
  if (!navigator.cookieEnabled) {
    return;
  }
  function getCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
  const cookieName = \`builder.tests.\${defaultContentId}\`;
  const winningVariant = getCookie(cookieName);
  const parentDiv = document.currentScript?.parentElement;
  const isDefaultContent = variantContentId === defaultContentId;
  const isWinningVariant = winningVariant === variantContentId;
  if (isWinningVariant && !isDefaultContent) {
    parentDiv?.removeAttribute('hidden');
    parentDiv?.removeAttribute('aria-hidden');
  } else if (!isWinningVariant && isDefaultContent) {
    parentDiv?.setAttribute('hidden', 'true');
    parentDiv?.setAttribute('aria-hidden', 'true');
  }
  if (isHydrationTarget) {
    if (!isWinningVariant) {
      parentDiv?.remove();
    }
    const thisScriptEl = document.currentScript;
    thisScriptEl?.remove();
  }
  return;
}`, X = "builderIoAbTest", Z = "builderIoRenderContent", F = (e) => Object.values((e == null ? void 0 : e.variations) || {}).map((t) => ({
  ...t,
  testVariationId: t.id,
  id: e == null ? void 0 : e.id
})), Ge = ({
  canTrack: e,
  content: t
}) => !(!(F(t).length > 0) || !e || U()), Xe = (e) => e === "react" || e === "reactNative", ee = Xe(Q), Ze = () => `
  window.${X} = ${Ye}
  window.${Z} = ${Qe}
  `, et = (e, t) => `
  window.${X}(
    "${t}",${JSON.stringify(e)}, ${ee}
  )`, tt = ({
  contentId: e,
  variationId: t
}) => `window.${Z}(
    "${t}", "${e}", ${ee}
  )`;
function $(e) {
  return /* @__PURE__ */ f(
    "script",
    {
      dangerouslySetInnerHTML: { __html: e.scriptStr },
      "data-id": e.id
    }
  );
}
function z(e) {
  return Math.round(e * 1e3) / 1e3;
}
const nt = (e, t, n = !0) => {
  if (!(e instanceof HTMLElement))
    return null;
  let a = n ? e : e.parentElement;
  do {
    if (!a)
      return null;
    if (t(a))
      return a;
  } while (a = a.parentElement);
  return null;
}, at = (e) => nt(e, (t) => {
  const n = t.getAttribute("builder-id") || t.id;
  return (n == null ? void 0 : n.indexOf("builder-")) === 0;
}), J = ({
  event: e,
  target: t
}) => {
  const n = t.getBoundingClientRect(), a = e.clientX - n.left, d = e.clientY - n.top, p = z(a / n.width), i = z(d / n.height);
  return {
    x: p,
    y: i
  };
}, it = (e) => {
  const t = e.target, n = t && at(t), a = (n == null ? void 0 : n.getAttribute("builder-id")) || (n == null ? void 0 : n.id);
  return {
    targetBuilderElement: a || void 0,
    metadata: {
      targetOffset: t ? J({
        event: e,
        target: t
      }) : void 0,
      builderTargetOffset: n ? J({
        event: e,
        target: n
      }) : void 0,
      builderElementIndex: n && a ? [].slice.call(document.getElementsByClassName(a)).indexOf(n) : void 0
    }
  };
};
function ot(e) {
  var C, H, D, L, q, N, j;
  const t = ne(null);
  function n(r) {
    var m, l;
    const c = {
      ...e.builderContextSignal.rootState,
      ...r
    };
    e.builderContextSignal.rootSetState ? (l = (m = e.builderContextSignal).rootSetState) == null || l.call(m, c) : e.setBuilderContextSignal((s) => ({
      ...s,
      rootState: c
    }));
  }
  function a(r) {
    var m, l, s, g, V;
    const c = {
      ...e.builderContextSignal.content,
      ...r,
      data: {
        ...(m = e.builderContextSignal.content) == null ? void 0 : m.data,
        ...r == null ? void 0 : r.data
      },
      meta: {
        ...(l = e.builderContextSignal.content) == null ? void 0 : l.meta,
        ...r == null ? void 0 : r.meta,
        breakpoints: ((s = r == null ? void 0 : r.meta) == null ? void 0 : s.breakpoints) || ((V = (g = e.builderContextSignal.content) == null ? void 0 : g.meta) == null ? void 0 : V.breakpoints)
      }
    };
    e.setBuilderContextSignal((v) => ({
      ...v,
      content: c
    }));
  }
  const [d, p] = k(
    () => e.contentWrapper || "div"
  );
  function i(r) {
    return le({
      model: e.model,
      trustedHosts: e.trustedHosts,
      callbacks: {
        configureSdk: (c) => {
          var s;
          const { breakpoints: m, contentId: l } = c;
          !l || l !== ((s = e.builderContextSignal.content) == null ? void 0 : s.id) || m && a({
            meta: {
              breakpoints: m
            }
          });
        },
        animation: (c) => {
          he(c);
        },
        contentUpdate: (c) => {
          a(c);
        }
      }
    })(r);
  }
  function o() {
    var c, m;
    const r = (m = (c = e.builderContextSignal.content) == null ? void 0 : c.data) == null ? void 0 : m.jsCode;
    r && M({
      code: r,
      context: e.context || {},
      localState: void 0,
      rootState: e.builderContextSignal.rootState,
      rootSetState: e.builderContextSignal.rootSetState,
      /**
       * We don't want to cache the result of the JS code, since it's arbitrary side effect code.
       */
      enableCache: !1
    });
  }
  const [u, S] = k(() => ({})), [y, w] = k(() => ({})), [T, R] = k(() => !1);
  function E(r) {
    var c, m;
    if (e.builderContextSignal.content) {
      const l = (c = e.builderContextSignal.content) == null ? void 0 : c.testVariationId, s = (m = e.builderContextSignal.content) == null ? void 0 : m.id;
      _({
        type: "click",
        canTrack: W(e.canTrack),
        contentId: s,
        apiKey: e.apiKey,
        variationId: l !== s ? l : void 0,
        ...it(r),
        unique: !T
      });
    }
    T || R(!0);
  }
  function x() {
    var c, m, l;
    const r = (l = (m = (c = e.builderContextSignal.content) == null ? void 0 : c.data) == null ? void 0 : m.httpRequests) != null ? l : {};
    Object.entries(r).forEach(([s, g]) => {
      if (!g || y[s] || u[s] && !A())
        return;
      y[s] = !0;
      const V = g.replace(
        /{{([^}]+)}}/g,
        (v, te) => String(
          M({
            code: te,
            context: e.context || {},
            localState: void 0,
            rootState: e.builderContextSignal.rootState,
            rootSetState: e.builderContextSignal.rootSetState,
            enableCache: !0
          })
        )
      );
      de(V).then((v) => v.json()).then((v) => {
        n({
          [s]: v
        }), u[s] = !0;
      }).catch((v) => {
        console.error("error fetching dynamic data", g, v);
      }).finally(() => {
        y[s] = !1;
      });
    });
  }
  function b() {
    A() && window.dispatchEvent(
      new CustomEvent(
        "builder:component:stateChange",
        {
          detail: {
            state: ce(e.builderContextSignal.rootState),
            ref: {
              name: e.model
            }
          }
        }
      )
    );
  }
  return I(() => {
    var r, c;
    if (U()) {
      if (A() && (window.addEventListener("message", i), ae({
        ...e.locale ? {
          locale: e.locale
        } : {},
        ...e.enrich ? {
          enrich: e.enrich
        } : {},
        ...e.trustedHosts ? {
          trustedHosts: e.trustedHosts
        } : {}
      }), Object.values(
        e.builderContextSignal.componentInfos
      ).forEach((l) => {
        var g;
        const s = ie(l);
        (g = window.parent) == null || g.postMessage(s, "*");
      }), window.addEventListener(
        "builder:component:stateChangeListenerActivated",
        b
      )), e.builderContextSignal.content && W(e.canTrack)) {
        const l = (r = e.builderContextSignal.content) == null ? void 0 : r.testVariationId, s = (c = e.builderContextSignal.content) == null ? void 0 : c.id, g = e.apiKey;
        _({
          type: "impression",
          canTrack: !0,
          contentId: s,
          apiKey: g,
          variationId: l !== s ? l : void 0
        });
      }
      if (oe()) {
        const l = new URL(location.href).searchParams, s = l.get("builder.preview"), g = l.get(
          `builder.preview.${s}`
        ), V = l.get("apiKey") || l.get("builder.space");
        s === e.model && V === e.apiKey && (!e.content || g === e.content.id) && re({
          model: e.model,
          apiKey: e.apiKey,
          apiVersion: e.builderContextSignal.apiVersion
        }).then((v) => {
          v && a(v);
        });
      }
    }
  }, []), I(() => {
    e.apiKey || se.error(
      "No API key provided to `RenderContent` component. This can cause issues. Please provide an API key using the `apiKey` prop."
    ), o(), x(), b();
  }, []), I(() => {
    e.content && a(e.content);
  }, [e.content]), I(() => {
    o();
  }, [(H = (C = e.builderContextSignal.content) == null ? void 0 : C.data) == null ? void 0 : H.jsCode]), I(() => {
    x();
  }, [(L = (D = e.builderContextSignal.content) == null ? void 0 : D.data) == null ? void 0 : L.httpRequests]), I(() => {
    b();
  }, [e.builderContextSignal.rootState]), I(() => {
    e.data && n(e.data);
  }, [e.data]), I(() => {
    e.locale && n({
      locale: e.locale
    });
  }, [e.locale]), I(() => () => {
    U() && (window.removeEventListener("message", i), window.removeEventListener(
      "builder:component:stateChangeListenerActivated",
      b
    ));
  }, []), /* @__PURE__ */ f(fe.Provider, { value: e.builderContextSignal, children: e.builderContextSignal.content ? /* @__PURE__ */ f(
    d,
    {
      ref: t,
      onClick: (r) => E(r),
      "builder-content-id": (q = e.builderContextSignal.content) == null ? void 0 : q.id,
      "builder-model": e.model,
      ...e.showContent ? {} : {
        hidden: !0,
        "aria-hidden": !0
      },
      ...e.contentWrapperProps,
      className: `variant-${((N = e.content) == null ? void 0 : N.testVariationId) || ((j = e.content) == null ? void 0 : j.id)}`,
      children: e.children
    }
  ) : null });
}
const rt = (e) => {
  var p, i;
  const t = e.family + (e.kind && !e.kind.includes("#") ? ", " + e.kind : ""), n = t.split(",")[0], a = (i = e.fileUrl) != null ? i : (p = e == null ? void 0 : e.files) == null ? void 0 : p.regular;
  let d = "";
  if (a && t && n && (d += `
@font-face {
font-family: "${t}";
src: local("${n}"), url('${a}') format('woff2');
font-display: fallback;
font-weight: 400;
}
      `.trim()), e.files)
    for (const o in e.files) {
      if (!(String(Number(o)) === o))
        continue;
      const S = e.files[o];
      S && S !== a && (d += `
@font-face {
font-family: "${t}";
src: url('${S}') format('woff2');
font-display: fallback;
font-weight: ${o};
}
        `.trim());
    }
  return d;
}, st = ({
  customFonts: e
}) => {
  var t;
  return ((t = e == null ? void 0 : e.map((n) => rt(n))) == null ? void 0 : t.join(" ")) || "";
}, lt = ({
  cssCode: e,
  contentId: t
}) => e ? t ? (e == null ? void 0 : e.replace(/&/g, `div[builder-content-id="${t}"]`)) || "" : e : "", dt = `
.builder-button {
  all: unset;
}

.builder-text > p:first-of-type, .builder-text > .builder-paragraph:first-of-type {
  margin: 0;
}
.builder-text > p, .builder-text > .builder-paragraph {
  color: inherit;
  line-height: inherit;
  letter-spacing: inherit;
  font-weight: inherit;
  font-size: inherit;
  text-align: inherit;
  font-family: inherit;
}
`, ct = (e) => e ? "" : dt;
function ut(e) {
  const [t, n] = k(
    () => `
${lt({
      cssCode: e.cssCode,
      contentId: e.contentId
    })}
${st({
      customFonts: e.customFonts
    })}
${ct(e.isNestedRender)}
`.trim()
  );
  return /* @__PURE__ */ f(G, { id: "builderio-content", styles: t });
}
const mt = ({
  content: e,
  data: t,
  locale: n
}) => {
  var p, i, o;
  const a = {}, d = ((p = e == null ? void 0 : e.data) == null ? void 0 : p.state) || {};
  return (o = (i = e == null ? void 0 : e.data) == null ? void 0 : i.inputs) == null || o.forEach((u) => {
    u.name && u.defaultValue !== void 0 && (a[u.name] = u.defaultValue);
  }), {
    ...a,
    ...d,
    ...t,
    ...n ? {
      locale: n
    } : {}
  };
}, pt = ({
  content: e,
  data: t
}) => e ? {
  ...e,
  data: {
    ...e == null ? void 0 : e.data,
    ...t
  },
  meta: e == null ? void 0 : e.meta
} : void 0;
function Y(e) {
  var u, S, y, w, T, R, E;
  const [t, n] = k(
    () => {
      var x, b;
      return tt({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        variationId: (x = e.content) == null ? void 0 : x.testVariationId,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        contentId: (b = e.content) == null ? void 0 : b.id
      });
    }
  );
  function a(x) {
    o((b) => ({
      ...b,
      rootState: x
    }));
  }
  const [d, p] = k(
    () => [
      ...O(),
      ...e.customComponents || []
    ].reduce(
      (x, { component: b, ...C }) => ({
        ...x,
        [C.name]: {
          component: b,
          ...B(C)
        }
      }),
      {}
    )
  ), [i, o] = k(() => ({
    content: pt({
      content: e.content,
      data: e.data
    }),
    localState: void 0,
    rootState: mt({
      content: e.content,
      data: e.data,
      locale: e.locale
    }),
    rootSetState: a,
    context: e.context || {},
    apiKey: e.apiKey,
    apiVersion: e.apiVersion,
    componentInfos: [
      ...O(),
      ...e.customComponents || []
    ].reduce(
      (x, { component: b, ...C }) => ({
        ...x,
        [C.name]: B(C)
      }),
      {}
    ),
    inheritedStyles: {},
    BlocksWrapper: e.blocksWrapper || "div",
    BlocksWrapperProps: e.blocksWrapperProps || {}
  }));
  return /* @__PURE__ */ f(
    be.Provider,
    {
      value: {
        registeredComponents: d
      },
      children: /* @__PURE__ */ P(
        ot,
        {
          content: e.content,
          data: e.data,
          model: e.model,
          context: e.context,
          apiKey: e.apiKey,
          canTrack: e.canTrack,
          locale: e.locale,
          enrich: e.enrich,
          showContent: e.showContent,
          builderContextSignal: i,
          contentWrapper: e.contentWrapper,
          contentWrapperProps: e.contentWrapperProps,
          linkComponent: e.linkComponent,
          trustedHosts: e.trustedHosts,
          setBuilderContextSignal: o,
          children: [
            e.isSsrAbTest ? /* @__PURE__ */ f(
              $,
              {
                id: "builderio-variant-visibility",
                scriptStr: t
              }
            ) : null,
            /* @__PURE__ */ f(
              ut,
              {
                isNestedRender: e.isNestedRender,
                contentId: (u = i.content) == null ? void 0 : u.id,
                cssCode: (y = (S = i.content) == null ? void 0 : S.data) == null ? void 0 : y.cssCode,
                customFonts: (T = (w = i.content) == null ? void 0 : w.data) == null ? void 0 : T.customFonts
              }
            ),
            /* @__PURE__ */ f(
              ye,
              {
                blocks: (E = (R = i.content) == null ? void 0 : R.data) == null ? void 0 : E.blocks,
                context: i,
                registeredComponents: d,
                linkComponent: e.linkComponent
              }
            )
          ]
        }
      )
    }
  );
}
function vt(e) {
  var i;
  const [t, n] = k(
    () => Ge({
      canTrack: W(e.canTrack),
      content: e.content
    })
  );
  function a() {
    var o;
    return et(
      F(e.content).map((u) => ({
        id: u.testVariationId,
        testRatio: u.testRatio
      })),
      ((o = e.content) == null ? void 0 : o.id) || ""
    );
  }
  function d() {
    return F(e.content).map((o) => `.variant-${o.testVariationId} { display: none; } `).join("");
  }
  function p() {
    var o;
    return t ? {
      ...e.content,
      testVariationId: (o = e.content) == null ? void 0 : o.id
    } : ue({
      item: e.content,
      canTrack: W(e.canTrack)
    });
  }
  return I(() => {
  }, []), /* @__PURE__ */ P(K, { children: [
    !e.isNestedRender && Q !== "reactNative" ? /* @__PURE__ */ f(
      $,
      {
        id: "builderio-init-variants-fns",
        scriptStr: Ze()
      }
    ) : null,
    t ? /* @__PURE__ */ P(K, { children: [
      /* @__PURE__ */ f(
        G,
        {
          id: "builderio-variants",
          styles: d()
        }
      ),
      /* @__PURE__ */ f(
        $,
        {
          id: "builderio-variants-visibility",
          scriptStr: a()
        }
      ),
      (i = F(e.content)) == null ? void 0 : i.map((o) => /* @__PURE__ */ f(
        Y,
        {
          isNestedRender: e.isNestedRender,
          content: o,
          showContent: !1,
          model: e.model,
          data: e.data,
          context: e.context,
          apiKey: e.apiKey,
          apiVersion: e.apiVersion,
          customComponents: e.customComponents,
          linkComponent: e.linkComponent,
          canTrack: e.canTrack,
          locale: e.locale,
          enrich: e.enrich,
          isSsrAbTest: t,
          blocksWrapper: e.blocksWrapper,
          blocksWrapperProps: e.blocksWrapperProps,
          contentWrapper: e.contentWrapper,
          contentWrapperProps: e.contentWrapperProps,
          trustedHosts: e.trustedHosts
        },
        o.testVariationId
      ))
    ] }) : null,
    /* @__PURE__ */ f(
      Y,
      {
        isNestedRender: e.isNestedRender,
        content: p(),
        showContent: !0,
        model: e.model,
        data: e.data,
        context: e.context,
        apiKey: e.apiKey,
        apiVersion: e.apiVersion,
        customComponents: e.customComponents,
        linkComponent: e.linkComponent,
        canTrack: e.canTrack,
        locale: e.locale,
        enrich: e.enrich,
        isSsrAbTest: t,
        blocksWrapper: e.blocksWrapper,
        blocksWrapperProps: e.blocksWrapperProps,
        contentWrapper: e.contentWrapper,
        contentWrapperProps: e.contentWrapperProps,
        trustedHosts: e.trustedHosts
      }
    )
  ] });
}
export {
  vt as default
};
