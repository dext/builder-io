var En = Object.defineProperty;
var Cn = (e, t, n) => t in e ? En(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Rt = (e, t, n) => (Cn(e, typeof t != "symbol" ? t + "" : t, n), n);
import { jsx as b, Fragment as H, jsxs as Dt } from "react/jsx-runtime";
import { createContext as Vr, useState as Hr, useEffect as jn, useContext as Br } from "react";
import { isEditing as Ut, isBrowser as Ft, getUserAttributes as On, logger as Xe, checkIsDefined as it, fastClone as Xr, TARGET as Kr } from "./server-entry-df819e6c.js";
import { getClassPropName as An } from "./get-class-prop-name-775bd8d0.js";
const Jr = Vr({
  content: null,
  context: {},
  localState: void 0,
  rootSetState() {
  },
  rootState: {},
  apiKey: null,
  apiVersion: void 0,
  componentInfos: {},
  inheritedStyles: {},
  BlocksWrapper: "div",
  BlocksWrapperProps: {}
}), bn = Vr({ registeredComponents: {} });
function In(e) {
  var t;
  return {
    ...(t = e.component) == null ? void 0 : t.options,
    ...e.options,
    /**
     * Our built-in components frequently make use of the block, so we provide all of it under `builderBlock`
     */
    builderBlock: e
  };
}
const Yr = ({
  builder: e,
  context: t,
  event: n,
  state: r
}) => Object.entries({
  state: r,
  Builder: e,
  // legacy
  builder: e,
  context: t,
  event: n
}), Tn = () => ({
  isEditing: Ut(),
  isBrowser: Ft(),
  isServer: !Ft(),
  getUserAttributes: () => On()
}), Nn = (e, {
  isExpression: t = !0
}) => /* we disable this for cases where we definitely don't want a return */ t && !(e.includes(";") || e.includes(" return ") || e.trim().startsWith("return ")) ? `return (${e});` : e, Pn = ({
  code: e,
  builder: t,
  context: n,
  event: r,
  localState: o,
  rootSetState: s,
  rootState: a
}) => {
  const f = Yr({
    builder: t,
    context: n,
    event: r,
    state: Zr({
      rootState: a,
      localState: o,
      rootSetState: s
    })
  });
  return new Function(...f.map(([g]) => g), e)(...f.map(([, g]) => g));
};
function Zr({
  rootState: e,
  localState: t,
  rootSetState: n
}) {
  return new Proxy(e, {
    get: (r, o) => {
      if (t && o in t)
        return t[o];
      const s = r[o];
      return typeof s == "object" && s !== null ? Zr({
        rootState: s,
        localState: void 0,
        rootSetState: n ? (a) => {
          r[o] = a, n(r);
        } : void 0
      }) : s;
    },
    set: (r, o, s) => {
      if (t && o in t)
        throw new Error("Writing to local state is not allowed as it is read-only.");
      return r[o] = s, n == null || n(r), !0;
    }
  });
}
const zr = (e, t, n) => {
  if (Object(e) !== e)
    return e;
  const r = Array.isArray(t) ? t : t.toString().match(/[^.[\]]+/g);
  return r.slice(0, -1).reduce((o, s, a) => Object(o[s]) === o[s] ? o[s] : o[s] = Math.abs(Number(r[a + 1])) >> 0 === +r[a + 1] ? [] : {}, e)[r[r.length - 1]] = n, e;
};
var T, Rn = function(e) {
  function t(i) {
    return 48 > i ? i === 36 : 58 > i ? !0 : 65 > i ? !1 : 91 > i ? !0 : 97 > i ? i === 95 : 123 > i ? !0 : 170 <= i && xn.test(String.fromCharCode(i));
  }
  function n(i) {
    return 65 > i ? i === 36 : 91 > i ? !0 : 97 > i ? i === 95 : 123 > i ? !0 : 170 <= i && Mr.test(String.fromCharCode(i));
  }
  function r(i, l) {
    for (var u = d, p = 1, x = 0; ; ) {
      ot.lastIndex = x;
      var U = ot.exec(u);
      if (U && U.index < i)
        ++p, x = U.index + U[0].length;
      else
        break;
    }
    throw u = {
      line: p,
      ab: i - x
    }, l += " (" + u.line + ":" + u.ab + ")", l = new SyntaxError(l), l.j = i, l.X = u, l.o = c, l;
  }
  function o(i) {
    i = i.split(" ");
    for (var l = /* @__PURE__ */ Object.create(null), u = 0; u < i.length; u++)
      l[i[u]] = !0;
    return function(p) {
      return l[p] || !1;
    };
  }
  function s() {
    this.line = ge, this.ab = c - ee;
  }
  function a(i, l) {
    Se = c, E.C && (St = new s()), w = i, g(), J = l, Me = i.m;
  }
  function f() {
    for (var i = c, l = E.va && E.C && new s(), u = d.charCodeAt(c += 2); c < me && u !== 10 && u !== 13 && u !== 8232 && u !== 8233; )
      ++c, u = d.charCodeAt(c);
    E.va && E.va(!1, d.slice(i + 2, c), i, c, l, E.C && new s());
  }
  function g() {
    for (; c < me; ) {
      var i = d.charCodeAt(c);
      if (i === 32)
        ++c;
      else if (i === 13)
        ++c, i = d.charCodeAt(c), i === 10 && ++c, E.C && (++ge, ee = c);
      else if (i === 10 || i === 8232 || i === 8233)
        ++c, E.C && (++ge, ee = c);
      else if (8 < i && 14 > i)
        ++c;
      else if (i === 47)
        if (i = d.charCodeAt(c + 1), i === 42) {
          i = void 0;
          var l = E.va && E.C && new s(), u = c, p = d.indexOf("*/", c += 2);
          if (p === -1 && r(c - 2, "Unterminated comment"), c = p + 2, E.C)
            for (ot.lastIndex = u; (i = ot.exec(d)) && i.index < c; )
              ++ge, ee = i.index + i[0].length;
          E.va && E.va(!0, d.slice(u + 2, p), u, c, l, E.C && new s());
        } else if (i === 47)
          f();
        else
          break;
      else if (i === 160)
        ++c;
      else if (5760 <= i && wn.test(String.fromCharCode(i)))
        ++c;
      else
        break;
    }
  }
  function C(i) {
    switch (i) {
      case 46:
        i = d.charCodeAt(c + 1), 48 <= i && 57 >= i ? I(!0) : (++c, a(Or));
        return;
      case 40:
        return ++c, a(te);
      case 41:
        return ++c, a(Z);
      case 59:
        return ++c, a(re);
      case 44:
        return ++c, a(ce);
      case 91:
        return ++c, a(It);
      case 93:
        return ++c, a(Tt);
      case 123:
        return ++c, a(Ue);
      case 125:
        return ++c, a(xe);
      case 58:
        return ++c, a(Fe);
      case 63:
        return ++c, a(Ar);
      case 48:
        if (i = d.charCodeAt(c + 1), i === 120 || i === 88) {
          c += 2, i = P(16), i === null && r(D + 2, "Expected hexadecimal number"), n(d.charCodeAt(c)) && r(c, "Identifier directly after number"), a(De, i);
          return;
        }
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
        return I(!1);
      case 34:
      case 39:
        c++;
        for (var l = ""; ; ) {
          c >= me && r(D, "Unterminated string constant");
          var u = d.charCodeAt(c);
          if (u === i) {
            ++c, a(et, l);
            break;
          }
          if (u === 92) {
            u = d.charCodeAt(++c);
            var p = /^[0-7]+/.exec(d.slice(c, c + 3));
            for (p && (p = p[0]); p && 255 < parseInt(p, 8); )
              p = p.slice(0, -1);
            if (p === "0" && (p = null), ++c, p)
              K && r(c - 2, "Octal literal in strict mode"), l += String.fromCharCode(parseInt(p, 8)), c += p.length - 1;
            else
              switch (u) {
                case 110:
                  l += `
`;
                  break;
                case 114:
                  l += "\r";
                  break;
                case 120:
                  l += String.fromCharCode(W(2));
                  break;
                case 117:
                  l += String.fromCharCode(W(4));
                  break;
                case 85:
                  l += String.fromCharCode(W(8));
                  break;
                case 116:
                  l += "	";
                  break;
                case 98:
                  l += "\b";
                  break;
                case 118:
                  l += "\v";
                  break;
                case 102:
                  l += "\f";
                  break;
                case 48:
                  l += "\0";
                  break;
                case 13:
                  d.charCodeAt(c) === 10 && ++c;
                case 10:
                  E.C && (ee = c, ++ge);
                  break;
                default:
                  l += String.fromCharCode(u);
              }
          } else
            u !== 13 && u !== 10 && u !== 8232 && u !== 8233 || r(D, "Unterminated string constant"), l += String.fromCharCode(u), ++c;
        }
        return;
      case 47:
        i = d.charCodeAt(c + 1), Me ? (++c, N()) : i === 61 ? S(de, 2) : S(br, 1);
        return;
      case 37:
      case 42:
        d.charCodeAt(c + 1) === 61 ? S(de, 2) : S(vn, 1);
        return;
      case 124:
      case 38:
        l = d.charCodeAt(c + 1), l === i ? S(i === 124 ? Nr : Pr, 2) : l === 61 ? S(de, 2) : S(i === 124 ? cn : pn, 1);
        return;
      case 94:
        d.charCodeAt(c + 1) === 61 ? S(de, 2) : S(fn, 1);
        return;
      case 43:
      case 45:
        l = d.charCodeAt(c + 1), l === i ? l === 45 && d.charCodeAt(c + 2) === 62 && nt.test(d.slice(ue, c)) ? (c += 3, f(), g(), j()) : S(un, 2) : l === 61 ? S(de, 2) : S(yn, 1);
        return;
      case 60:
      case 62:
        l = d.charCodeAt(c + 1), u = 1, l === i ? (u = i === 62 && d.charCodeAt(c + 2) === 62 ? 3 : 2, d.charCodeAt(c + u) === 61 ? S(de, u + 1) : S(dn, u)) : l === 33 && i === 60 && d.charCodeAt(c + 2) === 45 && d.charCodeAt(c + 3) === 45 ? (c += 4, f(), g(), j()) : (l === 61 && (u = d.charCodeAt(c + 2) === 61 ? 3 : 2), S(gn, u));
        return;
      case 61:
      case 33:
        d.charCodeAt(c + 1) === 61 ? S(hn, d.charCodeAt(c + 2) === 61 ? 3 : 2) : S(i === 61 ? Ir : Tr, 1);
        return;
      case 126:
        return S(Tr, 1);
    }
    return !1;
  }
  function j(i) {
    if (i ? c = D + 1 : D = c, E.C && (mt = new s()), i)
      return N();
    if (c >= me)
      return a(kt);
    if (i = d.charCodeAt(c), n(i) || i === 92)
      return pe();
    if (C(i) === !1) {
      if (i = String.fromCharCode(i), i === "\\" || Mr.test(i))
        return pe();
      r(c, "Unexpected character '" + i + "'");
    }
  }
  function S(i, l) {
    var u = d.slice(c, c + l);
    c += l, a(i, u);
  }
  function N() {
    for (var i, l, u = c; ; ) {
      c >= me && r(u, "Unterminated regexp");
      var p = d.charAt(c);
      if (nt.test(p) && r(u, "Unterminated regexp"), i)
        i = !1;
      else {
        if (p === "[")
          l = !0;
        else if (p === "]" && l)
          l = !1;
        else if (p === "/" && !l)
          break;
        i = p === "\\";
      }
      ++c;
    }
    i = d.slice(u, c), ++c, (l = z()) && !/^[gmi]*$/.test(l) && r(u, "Invalid regexp flag");
    try {
      var x = new RegExp(i, l);
    } catch (U) {
      throw U instanceof SyntaxError && r(u, U.message), U;
    }
    a(ar, x);
  }
  function P(i, l) {
    for (var u = c, p = 0, x = l === void 0 ? 1 / 0 : l, U = 0; U < x; ++U) {
      var G = d.charCodeAt(c);
      if (G = 97 <= G ? G - 97 + 10 : 65 <= G ? G - 65 + 10 : 48 <= G && 57 >= G ? G - 48 : 1 / 0, G >= i)
        break;
      ++c, p = p * i + G;
    }
    return c === u || l !== void 0 && c - u !== l ? null : p;
  }
  function I(i) {
    var l = c, u = !1, p = d.charCodeAt(c) === 48;
    i || P(10) !== null || r(l, "Invalid number"), d.charCodeAt(c) === 46 && (++c, P(10), u = !0), i = d.charCodeAt(c), (i === 69 || i === 101) && (i = d.charCodeAt(++c), i !== 43 && i !== 45 || ++c, P(10) === null && r(l, "Invalid number"), u = !0), n(d.charCodeAt(c)) && r(c, "Identifier directly after number"), i = d.slice(l, c);
    var x;
    u ? x = parseFloat(i) : p && i.length !== 1 ? /[89]/.test(i) || K ? r(l, "Invalid number") : x = parseInt(i, 8) : x = parseInt(i, 10), a(De, x);
  }
  function W(i) {
    return i = P(16, i), i === null && r(D, "Bad character escape sequence"), i;
  }
  function z() {
    ke = !1;
    for (var i, l = !0, u = c; ; ) {
      var p = d.charCodeAt(c);
      if (t(p))
        ke && (i += d.charAt(c)), ++c;
      else if (p === 92) {
        ke || (i = d.slice(u, c)), ke = !0, d.charCodeAt(++c) !== 117 && r(c, "Expecting Unicode escape sequence \\uXXXX"), ++c, p = W(4);
        var x = String.fromCharCode(p);
        x || r(c - 1, "Invalid Unicode escape"), (l ? n(p) : t(p)) || r(c - 4, "Invalid Unicode escape"), i += x;
      } else
        break;
      l = !1;
    }
    return ke ? i : d.slice(u, c);
  }
  function pe() {
    var i = z(), l = we;
    !ke && Sn(i) && (l = ln[i]), a(l, i);
  }
  function O() {
    wt = D, ue = Se, xt = St, j();
  }
  function ve(i) {
    if (K = i, c = D, E.C)
      for (; c < ee; )
        ee = d.lastIndexOf(`
`, ee - 2) + 1, --ge;
    g(), j();
  }
  function Ie() {
    this.type = null, this.start = D, this.end = null;
  }
  function Te() {
    this.start = mt, this.end = null, vt && (this.source = vt);
  }
  function L() {
    var i = new Ie();
    return E.C && (i.X = new Te()), E.vb && (i.sourceFile = E.vb), E.Xa && (i.j = [D, 0]), i;
  }
  function le(i) {
    var l = new Ie();
    return l.start = i.start, E.C && (l.X = new Te(), l.X.start = i.X.start), E.Xa && (l.j = [i.j[0], 0]), l;
  }
  function k(i, l) {
    return i.type = l, i.end = ue, E.C && (i.X.end = xt), E.Xa && (i.j[1] = ue), i;
  }
  function ct(i) {
    return i.type === "ExpressionStatement" && i.la.type === "Literal" && i.la.value === "use strict";
  }
  function R(i) {
    return w === i ? (O(), !0) : !1;
  }
  function ze() {
    return !E.fc && (w === kt || w === xe || nt.test(d.slice(ue, D)));
  }
  function he() {
    R(re) || ze() || Q();
  }
  function M(i) {
    w === i ? O() : Q();
  }
  function Q() {
    r(D, "Unexpected token");
  }
  function Qe(i) {
    i.type !== "Identifier" && i.type !== "MemberExpression" && r(i.start, "Assigning to rvalue"), K && i.type === "Identifier" && rt(i.name) && r(i.start, "Assigning to " + i.name + " in strict mode");
  }
  function Y() {
    (w === br || w === de && J === "/=") && j(!0);
    var i = w, l = L();
    switch (i) {
      case Et:
      case ur:
        O();
        var u = i === Et;
        R(re) || ze() ? l.label = null : w !== we ? Q() : (l.label = q(), he());
        for (var p = 0; p < B.length; ++p) {
          var x = B[p];
          if ((l.label === null || x.name === l.label.name) && (x.kind !== null && (u || x.kind === "loop") || l.label && u))
            break;
        }
        return p === B.length && r(l.start, "Unsyntactic " + i.l), k(l, u ? "BreakStatement" : "ContinueStatement");
      case cr:
        return O(), he(), k(l, "DebuggerStatement");
      case pr:
        return O(), B.push(Nt), l.body = Y(), B.pop(), M(bt), l.test = Ne(), he(), k(l, "DoWhileStatement");
      case dr:
        return O(), B.push(Nt), M(te), w === re ? ft(l, null) : w === At ? (i = L(), O(), ir(i, !0), k(i, "VariableDeclaration"), i.fa.length === 1 && R(tt) ? or(l, i) : ft(l, i)) : (i = $(!1, !0), R(tt) ? (Qe(i), or(l, i)) : ft(l, i));
      case jt:
        return O(), dt(l, !0);
      case yr:
        return O(), l.test = Ne(), l.da = Y(), l.alternate = R(hr) ? Y() : null, k(l, "IfStatement");
      case vr:
        return Be || E.Ib || r(D, "'return' outside of function"), O(), R(re) || ze() ? l.K = null : (l.K = $(), he()), k(l, "ReturnStatement");
      case Ot:
        for (O(), l.Qb = Ne(), l.tb = [], M(Ue), B.push(kn); w !== xe; )
          w === Ct || w === fr ? (i = w === Ct, p && k(p, "SwitchCase"), l.tb.push(p = L()), p.da = [], O(), i ? p.test = $() : (u && r(wt, "Multiple default clauses"), u = !0, p.test = null), M(Fe)) : (p || Q(), p.da.push(Y()));
        return p && k(p, "SwitchCase"), O(), B.pop(), k(l, "SwitchStatement");
      case mr:
        return O(), nt.test(d.slice(ue, D)) && r(ue, "Illegal newline after throw"), l.K = $(), he(), k(l, "ThrowStatement");
      case Sr:
        return O(), l.block = Pe(), l.Ea = null, w === lr && (i = L(), O(), M(te), i.Ua = q(), K && rt(i.Ua.name) && r(i.Ua.start, "Binding " + i.Ua.name + " in strict mode"), M(Z), i.body = Pe(), l.Ea = k(i, "CatchClause")), l.fb = R(gr) ? Pe() : null, l.Ea || l.fb || r(l.start, "Missing catch or finally clause"), k(l, "TryStatement");
      case At:
        return O(), ir(l), he(), k(l, "VariableDeclaration");
      case bt:
        return O(), l.test = Ne(), B.push(Nt), l.body = Y(), B.pop(), k(l, "WhileStatement");
      case wr:
        return K && r(D, "'with' in strict mode"), O(), l.object = Ne(), l.body = Y(), k(l, "WithStatement");
      case Ue:
        return Pe();
      case re:
        return O(), k(l, "EmptyStatement");
      default:
        if (u = J, x = $(), i === we && x.type === "Identifier" && R(Fe)) {
          for (p = 0; p < B.length; ++p)
            B[p].name === u && r(x.start, "Label '" + u + "' is already declared");
          return B.push({
            name: u,
            kind: w.W ? "loop" : w === Ot ? "switch" : null
          }), l.body = Y(), B.pop(), l.label = x, k(l, "LabeledStatement");
        }
        return l.la = x, he(), k(l, "ExpressionStatement");
    }
  }
  function Ne() {
    M(te);
    var i = $();
    return M(Z), i;
  }
  function Pe(i) {
    var l = L(), u = !0, p = !1;
    for (l.body = [], M(Ue); !R(xe); ) {
      var x = Y();
      if (l.body.push(x), u && i && ct(x)) {
        var U = p;
        ve(p = !0);
      }
      u = !1;
    }
    return p && !U && ve(!1), k(l, "BlockStatement");
  }
  function ft(i, l) {
    return i.ua = l, M(re), i.test = w === re ? null : $(), M(re), i.update = w === Z ? null : $(), M(Z), i.body = Y(), B.pop(), k(i, "ForStatement");
  }
  function or(i, l) {
    return i.left = l, i.right = $(), M(Z), i.body = Y(), B.pop(), k(i, "ForInStatement");
  }
  function ir(i, l) {
    for (i.fa = [], i.kind = "var"; ; ) {
      var u = L();
      if (u.id = q(), K && rt(u.id.name) && r(u.id.start, "Binding " + u.id.name + " in strict mode"), u.ua = R(Ir) ? $(!0, l) : null, i.fa.push(k(u, "VariableDeclarator")), !R(ce))
        break;
    }
  }
  function $(i, l) {
    var u = pt(l);
    if (!i && w === ce) {
      for (i = le(u), i.xb = [u]; R(ce); )
        i.xb.push(pt(l));
      return k(i, "SequenceExpression");
    }
    return u;
  }
  function pt(i) {
    var l = ht(gt(), -1, i);
    if (R(Ar)) {
      var u = le(l);
      u.test = l, u.da = $(!0), M(Fe), u.alternate = $(!0, i), l = k(u, "ConditionalExpression");
    }
    return w.Cb ? (u = le(l), u.operator = J, u.left = l, O(), u.right = pt(i), Qe(l), k(u, "AssignmentExpression")) : l;
  }
  function ht(i, l, u) {
    var p = w.L;
    if (p !== null && (!u || w !== tt) && p > l) {
      var x = le(i);
      return x.left = i, x.operator = J, i = w, O(), x.right = ht(gt(), p, u), p = k(x, i === Nr || i === Pr ? "LogicalExpression" : "BinaryExpression"), ht(p, l, u);
    }
    return i;
  }
  function gt() {
    if (w.prefix) {
      var i = L(), l = w.$b;
      return i.operator = J, Me = i.prefix = !0, O(), i.K = gt(), l ? Qe(i.K) : K && i.operator === "delete" && i.K.type === "Identifier" && r(i.start, "Deleting local variable in strict mode"), k(i, l ? "UpdateExpression" : "UnaryExpression");
    }
    for (l = Re(qe()); w.cc && !ze(); )
      i = le(l), i.operator = J, i.prefix = !1, i.K = l, Qe(l), O(), l = k(i, "UpdateExpression");
    return l;
  }
  function Re(i, l) {
    if (R(Or)) {
      var u = le(i);
      return u.object = i, u.Wa = q(!0), u.bb = !1, Re(k(u, "MemberExpression"), l);
    }
    return R(It) ? (u = le(i), u.object = i, u.Wa = $(), u.bb = !0, M(Tt), Re(k(u, "MemberExpression"), l)) : !l && R(te) ? (u = le(i), u.callee = i, u.arguments = yt(Z, !1), Re(k(u, "CallExpression"), l)) : i;
  }
  function qe() {
    switch (w) {
      case kr:
        var i = L();
        return O(), k(i, "ThisExpression");
      case we:
        return q();
      case De:
      case et:
      case ar:
        return i = L(), i.value = J, i.raw = d.slice(D, Se), O(), k(i, "Literal");
      case Er:
      case Cr:
      case jr:
        return i = L(), i.value = w.$a, i.raw = w.l, O(), k(i, "Literal");
      case te:
        i = mt;
        var l = D;
        O();
        var u = $();
        return u.start = l, u.end = Se, E.C && (u.X.start = i, u.X.end = St), E.Xa && (u.j = [l, Se]), M(Z), u;
      case It:
        return i = L(), O(), i.elements = yt(Tt, !0, !0), k(i, "ArrayExpression");
      case Ue:
        for (i = L(), l = !0, u = !1, i.h = [], O(); !R(xe); ) {
          if (l)
            l = !1;
          else if (M(ce), E.sb && R(xe))
            break;
          var p = {
            key: w === De || w === et ? qe() : q(!0)
          }, x = !1;
          if (R(Fe)) {
            p.value = $(!0);
            var U = p.kind = "init";
          } else
            p.key.type !== "Identifier" || p.key.name !== "get" && p.key.name !== "set" ? Q() : (x = u = !0, U = p.kind = p.key.name, p.key = w === De || w === et ? qe() : q(!0), w !== te && Q(), p.value = dt(L(), !1));
          if (p.key.type === "Identifier" && (K || u))
            for (var G = 0; G < i.h.length; ++G) {
              var Ee = i.h[G];
              if (Ee.key.name === p.key.name) {
                var Pt = U === Ee.kind || x && Ee.kind === "init" || U === "init" && (Ee.kind === "get" || Ee.kind === "set");
                Pt && !K && U === "init" && Ee.kind === "init" && (Pt = !1), Pt && r(p.key.start, "Redefinition of property");
              }
            }
          i.h.push(p);
        }
        return k(i, "ObjectExpression");
      case jt:
        return i = L(), O(), dt(i, !1);
      case xr:
        return i = L(), O(), i.callee = Re(qe(), !0), i.arguments = R(te) ? yt(Z, !1) : an, k(i, "NewExpression");
    }
    Q();
  }
  function dt(i, l) {
    w === we ? i.id = q() : l ? Q() : i.id = null, i.oa = [];
    var u = !0;
    for (M(te); !R(Z); )
      u ? u = !1 : M(ce), i.oa.push(q());
    u = Be;
    var p = B;
    if (Be = !0, B = [], i.body = Pe(!0), Be = u, B = p, K || i.body.body.length && ct(i.body.body[0])) {
      for (u = i.id ? -1 : 0; u < i.oa.length; ++u)
        if (p = 0 > u ? i.id : i.oa[u], (Rr(p.name) || rt(p.name)) && r(p.start, "Defining '" + p.name + "' in strict mode"), 0 <= u)
          for (var x = 0; x < u; ++x)
            p.name === i.oa[x].name && r(p.start, "Argument name clash in strict mode");
    }
    return k(i, l ? "FunctionDeclaration" : "FunctionExpression");
  }
  function yt(i, l, u) {
    for (var p = [], x = !0; !R(i); ) {
      if (x)
        x = !1;
      else if (M(ce), l && E.sb && R(i))
        break;
      p.push(u && w === ce ? null : $(!0));
    }
    return p;
  }
  function q(i) {
    var l = L();
    return i && E.yb === "everywhere" && (i = !1), w === we ? (!i && (E.yb && mn(J) || K && Rr(J)) && d.slice(D, Se).indexOf("\\") === -1 && r(D, "The keyword '" + J + "' is reserved"), l.name = J) : i && w.l ? l.name = w.l : Q(), Me = !1, O(), k(l, "Identifier");
  }
  e.version = "0.5.0";
  var E, d = "", me, vt;
  e.parse = function(i, l) {
    d = String(i), me = d.length, E = l || {};
    for (var u in sr)
      Object.prototype.hasOwnProperty.call(E, u) || (E[u] = sr[u]);
    for (vt = E.sourceFile, ge = 1, c = ee = 0, Me = !0, g(), u = E.dc, wt = ue = c, E.C && (xt = new s()), Be = K = !1, B = [], j(), i = u || L(), l = !0, u || (i.body = []); w !== kt; )
      u = Y(), i.body.push(u), l && ct(u) && ve(!0), l = !1;
    return k(i, "Program");
  };
  var sr = {
    fc: !1,
    sb: !0,
    yb: !1,
    Ib: !1,
    C: !1,
    va: null,
    Xa: !1,
    dc: null,
    sourceFile: null,
    vb: null
  }, c = 0, D = 0, Se = 0, mt, St, w, J, Me, ge, ee, wt = 0, ue = 0, xt, Be, B, K, an = [], De = {
    type: "num"
  }, ar = {
    type: "regexp"
  }, et = {
    type: "string"
  }, we = {
    type: "name"
  }, kt = {
    type: "eof"
  }, Et = {
    l: "break"
  }, Ct = {
    l: "case",
    m: !0
  }, lr = {
    l: "catch"
  }, ur = {
    l: "continue"
  }, cr = {
    l: "debugger"
  }, fr = {
    l: "default"
  }, pr = {
    l: "do",
    W: !0
  }, hr = {
    l: "else",
    m: !0
  }, gr = {
    l: "finally"
  }, dr = {
    l: "for",
    W: !0
  }, jt = {
    l: "function"
  }, yr = {
    l: "if"
  }, vr = {
    l: "return",
    m: !0
  }, Ot = {
    l: "switch"
  }, mr = {
    l: "throw",
    m: !0
  }, Sr = {
    l: "try"
  }, At = {
    l: "var"
  }, bt = {
    l: "while",
    W: !0
  }, wr = {
    l: "with"
  }, xr = {
    l: "new",
    m: !0
  }, kr = {
    l: "this"
  }, Er = {
    l: "null",
    $a: null
  }, Cr = {
    l: "true",
    $a: !0
  }, jr = {
    l: "false",
    $a: !1
  }, tt = {
    l: "in",
    L: 7,
    m: !0
  }, ln = {
    break: Et,
    case: Ct,
    catch: lr,
    continue: ur,
    debugger: cr,
    default: fr,
    do: pr,
    else: hr,
    finally: gr,
    for: dr,
    function: jt,
    if: yr,
    return: vr,
    switch: Ot,
    throw: mr,
    try: Sr,
    var: At,
    while: bt,
    with: wr,
    null: Er,
    true: Cr,
    false: jr,
    new: xr,
    in: tt,
    instanceof: {
      l: "instanceof",
      L: 7,
      m: !0
    },
    this: kr,
    typeof: {
      l: "typeof",
      prefix: !0,
      m: !0
    },
    void: {
      l: "void",
      prefix: !0,
      m: !0
    },
    delete: {
      l: "delete",
      prefix: !0,
      m: !0
    }
  }, It = {
    type: "[",
    m: !0
  }, Tt = {
    type: "]"
  }, Ue = {
    type: "{",
    m: !0
  }, xe = {
    type: "}"
  }, te = {
    type: "(",
    m: !0
  }, Z = {
    type: ")"
  }, ce = {
    type: ",",
    m: !0
  }, re = {
    type: ";",
    m: !0
  }, Fe = {
    type: ":",
    m: !0
  }, Or = {
    type: "."
  }, Ar = {
    type: "?",
    m: !0
  }, br = {
    L: 10,
    m: !0
  }, Ir = {
    Cb: !0,
    m: !0
  }, de = {
    Cb: !0,
    m: !0
  }, un = {
    cc: !0,
    prefix: !0,
    $b: !0
  }, Tr = {
    prefix: !0,
    m: !0
  }, Nr = {
    L: 1,
    m: !0
  }, Pr = {
    L: 2,
    m: !0
  }, cn = {
    L: 3,
    m: !0
  }, fn = {
    L: 4,
    m: !0
  }, pn = {
    L: 5,
    m: !0
  }, hn = {
    L: 6,
    m: !0
  }, gn = {
    L: 7,
    m: !0
  }, dn = {
    L: 8,
    m: !0
  }, yn = {
    L: 9,
    prefix: !0,
    m: !0
  }, vn = {
    L: 10,
    m: !0
  }, mn = o("class enum extends super const export import"), Rr = o("implements interface let package private protected public static yield"), rt = o("eval arguments"), Sn = o("break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this"), wn = /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/, Mr = RegExp("[ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԧԱ-Ֆՙա-ևא-תװ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࢠࢢ-ࢬऄ-हऽॐक़-ॡॱ-ॷॹ-ॿঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-ళవ-హఽౘౙౠౡಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೞೠೡೱೲഅ-ഌഎ-ഐഒ-ഺഽൎൠൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄງຈຊຍດ-ທນ-ຟມ-ຣລວສຫອ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏼᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛰᜀ-ᜌᜎ-ᜑᜠ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡷᢀ-ᢨᢪᢰ-ᣵᤀ-ᤜᥐ-ᥭᥰ-ᥴᦀ-ᦫᧁ-ᧇᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭋᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᳩ-ᳬᳮ-ᳱᳵᳶᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕℙ-ℝℤΩℨK-ℭℯ-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-Ⱞⰰ-ⱞⱠ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞⸯ々-〇〡-〩〱-〵〸-〼ぁ-ゖゝ-ゟァ-ヺー-ヿㄅ-ㄭㄱ-ㆎㆠ-ㆺㇰ-ㇿ㐀-䶵一-鿌ꀀ-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚗꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꪀ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꯀ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ]"), xn = RegExp("[ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԧԱ-Ֆՙա-ևא-תװ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࢠࢢ-ࢬऄ-हऽॐक़-ॡॱ-ॷॹ-ॿঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-ళవ-హఽౘౙౠౡಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೞೠೡೱೲഅ-ഌഎ-ഐഒ-ഺഽൎൠൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄງຈຊຍດ-ທນ-ຟມ-ຣລວສຫອ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏼᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛰᜀ-ᜌᜎ-ᜑᜠ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡷᢀ-ᢨᢪᢰ-ᣵᤀ-ᤜᥐ-ᥭᥰ-ᥴᦀ-ᦫᧁ-ᧇᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭋᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᳩ-ᳬᳮ-ᳱᳵᳶᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕℙ-ℝℤΩℨK-ℭℯ-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-Ⱞⰰ-ⱞⱠ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞⸯ々-〇〡-〩〱-〵〸-〼ぁ-ゖゝ-ゟァ-ヺー-ヿㄅ-ㄭㄱ-ㆎㆠ-ㆺㇰ-ㇿ㐀-䶵一-鿌ꀀ-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚗꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꪀ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꯀ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ̀-ͯ҃-֑҇-ׇֽֿׁׂׅׄؐ-ؚؠ-ىٲ-ۓۧ-ۨۻ-ۼܰ-݊ࠀ-ࠔࠛ-ࠣࠥ-ࠧࠩ-࠭ࡀ-ࡗࣤ-ࣾऀ-ःऺ-़ा-ॏ॑-ॗॢ-ॣ०-९ঁ-ঃ়া-ৄেৈৗয়-ৠਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢ-ૣ૦-૯ଁ-ଃ଼ା-ୄେୈୋ-୍ୖୗୟ-ୠ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఁ-ఃె-ైొ-్ౕౖౢ-ౣ౦-౯ಂಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢ-ೣ೦-೯ംഃെ-ൈൗൢ-ൣ൦-൯ංඃ්ා-ුූෘ-ෟෲෳิ-ฺเ-ๅ๐-๙ິ-ູ່-ໍ໐-໙༘༙༠-༩༹༵༷ཁ-ཇཱ-྄྆-྇ྍ-ྗྙ-ྼ࿆က-ဩ၀-၉ၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟ᜎ-ᜐᜠ-ᜰᝀ-ᝐᝲᝳក-ឲ៝០-៩᠋-᠍᠐-᠙ᤠ-ᤫᤰ-᤻ᥑ-ᥭᦰ-ᧀᧈ-ᧉ᧐-᧙ᨀ-ᨕᨠ-ᩓ᩠-᩿᩼-᪉᪐-᪙ᭆ-ᭋ᭐-᭙᭫-᭳᮰-᮹᯦-᯳ᰀ-ᰢ᱀-᱉ᱛ-ᱽ᳐-᳒ᴀ-ᶾḁ-ἕ‌‍‿⁀⁔⃐-⃥⃜⃡-⃰ⶁ-ⶖⷠ-ⷿ〡-〨゙゚Ꙁ-ꙭꙴ-꙽ꚟ꛰-꛱ꟸ-ꠀ꠆ꠋꠣ-ꠧꢀ-ꢁꢴ-꣄꣐-꣙ꣳ-ꣷ꤀-꤉ꤦ-꤭ꤰ-ꥅꦀ-ꦃ꦳-꧀ꨀ-ꨧꩀ-ꩁꩌ-ꩍ꩐-꩙ꩻꫠ-ꫩꫲ-ꫳꯀ-ꯡ꯬꯭꯰-꯹ﬠ-ﬨ︀-️︠-︦︳︴﹍-﹏０-９＿]"), nt = /[\n\r\u2028\u2029]/, ot = /\r\n|[\n\r\u2028\u2029]/g, ke, Nt = {
    kind: "loop"
  }, kn = {
    kind: "switch"
  };
}, Lt = Lt = typeof globalThis == "undefined" ? void 0 : globalThis;
Rn(Lt.j || (Lt.j = {}));
function h(e, t) {
  typeof e == "string" && (e = Oe(e, "code"));
  var n = e.constructor;
  this.ya = function() {
    return new n({
      options: {}
    });
  };
  var r = this.ya(), o;
  for (o in e)
    r[o] = o === "body" ? e[o].slice() : e[o];
  this.ra = r, this.ca = [], this.qb = t, this.za = !1, this.ba = [], this.Ya = 0, this.rb = /* @__PURE__ */ Object.create(null), e = /^step([A-Z]\w*)$/;
  var s, a;
  for (a in this)
    typeof this[a] == "function" && (s = a.match(e)) && (this.rb[s[1]] = this[a].bind(this));
  this.N = Wt(this, this.ra, null), this.Na = this.N.object, this.ra = Oe(this.ba.join(`
`), "polyfills"), this.ba = void 0, at(this.ra), s = new v(this.ra, this.N), s.done = !1, this.o = [s], this.Eb(), this.value = void 0, this.ra = r, s = new v(this.ra, this.N), s.done = !1, this.o.length = 0, this.o[0] = s;
}
var Dr = {
  C: !0,
  kc: 5
}, $t = {
  configurable: !0,
  enumerable: !0,
  writable: !1
}, y = {
  configurable: !0,
  enumerable: !1,
  writable: !0
}, X = {
  configurable: !0,
  enumerable: !1,
  writable: !1
}, Le = {
  configurable: !1,
  enumerable: !1,
  writable: !1
}, Ur = {
  configurable: !1,
  enumerable: !0,
  writable: !0
}, Qr = {
  STEP_ERROR: !0
}, be = {
  SCOPE_REFERENCE: !0
}, Ke = {
  VALUE_IN_DESCRIPTOR: !0
}, Ce = {
  REGEXP_TIMEOUT: !0
}, Fr = [], ie = null, Ve = null, fe = typeof globalThis == "undefined" ? void 0 : globalThis, Mn = ["onmessage = function(e) {", "var result;", "var data = e.data;", "switch (data[0]) {", "case 'split':", "result = data[1].split(data[2], data[3]);", "break;", "case 'match':", "result = data[1].match(data[2]);", "break;", "case 'search':", "result = data[1].search(data[2]);", "break;", "case 'replace':", "result = data[1].replace(data[2], data[3]);", "break;", "case 'exec':", "var regexp = data[1];", "regexp.lastIndex = data[2];", "result = [regexp.exec(data[3]), data[1].lastIndex];", "break;", "default:", "throw Error('Unknown RegExp operation: ' + data[0]);", "}", "postMessage(result);", "close();", "};"];
function Gt(e) {
  var t = e >>> 0;
  return t === Number(e) ? t : NaN;
}
function He(e) {
  var t = e >>> 0;
  return String(t) === String(e) && t !== 4294967295 ? t : NaN;
}
function at(e, t, n) {
  t ? e.start = t : delete e.start, n ? e.end = n : delete e.end;
  for (var r in e)
    if (r !== "loc" && e.hasOwnProperty(r)) {
      var o = e[r];
      o && typeof o == "object" && at(o, t, n);
    }
}
h.prototype.REGEXP_MODE = 2;
h.prototype.REGEXP_THREAD_TIMEOUT = 1e3;
h.prototype.POLYFILL_TIMEOUT = 1e3;
T = h.prototype;
T.P = !1;
T.Ka = !1;
T.Kb = 0;
T.ic = 0;
function Oe(e, t) {
  var n = {}, r;
  for (r in Dr)
    n[r] = Dr[r];
  return n.sourceFile = t, fe.j.parse(e, n);
}
T.Jb = function(e) {
  var t = this.o[0];
  if (!t || t.node.type !== "Program")
    throw Error("Expecting original AST to start with a Program node");
  if (typeof e == "string" && (e = Oe(e, "appendCode" + this.Kb++)), !e || e.type !== "Program")
    throw Error("Expecting new AST to start with a Program node");
  Je(this, e, t.scope), Array.prototype.push.apply(t.node.body, e.body), t.node.body.jb = null, t.done = !1;
};
T.lb = function() {
  var e = this.o, t;
  do {
    var n = e[e.length - 1];
    if (this.za)
      break;
    if (!n || n.node.type === "Program" && n.done) {
      if (!this.ca.length)
        return !1;
      if (n = this.ca[0], !n || n.time > Date.now())
        n = null;
      else {
        this.ca.shift(), 0 <= n.interval && tn(this, n, n.interval);
        var r = new v(n.node, n.scope);
        n.zb && (r.ia = 2, r.B = this.Na, r.U = n.zb, r.Qa = !0, r.F = n.Lb), n = r;
      }
      if (!n)
        break;
    }
    r = n.node;
    var o = Ve;
    Ve = this;
    try {
      var s = this.rb[r.type](e, n, r);
    } catch (a) {
      if (a !== Qr)
        throw this.value !== a && (this.value = void 0), a;
    } finally {
      Ve = o;
    }
    if (s && e.push(s), this.P)
      throw this.value = void 0, Error("Getter not supported in this context");
    if (this.Ka)
      throw this.value = void 0, Error("Setter not supported in this context");
    t || r.end || (t = Date.now() + this.POLYFILL_TIMEOUT);
  } while (!r.end && t > Date.now());
  return !0;
};
T.Eb = function() {
  for (; !this.za && this.lb(); )
    ;
  return this.za;
};
function Bn(e, t) {
  e.g(t, "NaN", NaN, Le), e.g(t, "Infinity", 1 / 0, Le), e.g(t, "undefined", void 0, Le), e.g(t, "window", t, $t), e.g(t, "this", t, Le), e.g(t, "self", t), e.M = new A(null), e.Z = new A(e.M), Dn(e, t), Un(e, t), t.xa = e.M, e.g(t, "constructor", e.v, y), Fn(e, t), Ln(e, t), _n(e, t), Wn(e, t), $n(e, t), Gn(e, t), Vn(e, t), Hn(e, t), Xn(e, t);
  var n = e.i(function() {
    throw EvalError("Can't happen");
  }, !1);
  n.eval = !0, e.g(t, "eval", n, y), e.g(t, "parseInt", e.i(parseInt, !1), y), e.g(t, "parseFloat", e.i(parseFloat, !1), y), e.g(t, "isNaN", e.i(isNaN, !1), y), e.g(t, "isFinite", e.i(isFinite, !1), y);
  for (var r = [[escape, "escape"], [unescape, "unescape"], [decodeURI, "decodeURI"], [decodeURIComponent, "decodeURIComponent"], [encodeURI, "encodeURI"], [encodeURIComponent, "encodeURIComponent"]], o = 0; o < r.length; o++)
    n = function(s) {
      return function(a) {
        try {
          return s(a);
        } catch (f) {
          m(e, e.Gb, f.message);
        }
      };
    }(r[o][0]), e.g(t, r[o][1], e.i(n, !1), y);
  n = function(s) {
    return Lr(e, !1, arguments);
  }, e.g(t, "setTimeout", e.i(n, !1), y), n = function(s) {
    return Lr(e, !0, arguments);
  }, e.g(t, "setInterval", e.i(n, !1), y), n = function(s) {
    _r(e, s);
  }, e.g(t, "clearTimeout", e.i(n, !1), y), n = function(s) {
    _r(e, s);
  }, e.g(t, "clearInterval", e.i(n, !1), y), e.OBJECT = e.v, e.OBJECT_PROTO = e.M, e.FUNCTION = e.O, e.FUNCTION_PROTO = e.Z, e.ARRAY = e.qa, e.ARRAY_PROTO = e.La, e.REGEXP = e.I, e.REGEXP_PROTO = e.Ma, e.DATE = e.$, e.DATE_PROTO = e.nb, e.qb && e.qb(e, t);
}
T.Wb = 0;
function Dn(e, t) {
  var n = /^[A-Za-z_$][\w$]*$/, r = function(o) {
    var s = arguments.length ? String(arguments[arguments.length - 1]) : "", a = Array.prototype.slice.call(arguments, 0, -1).join(",").trim();
    if (a) {
      a = a.split(/\s*,\s*/);
      for (var f = 0; f < a.length; f++) {
        var g = a[f];
        n.test(g) || m(e, e.T, "Invalid function argument: " + g);
      }
      a = a.join(", ");
    }
    try {
      var C = Oe("(function(" + a + ") {" + s + "})", "function" + e.Wb++);
    } catch (j) {
      m(e, e.T, "Invalid code: " + j.message);
    }
    return C.body.length !== 1 && m(e, e.T, "Invalid code in function body"), Xt(e, C.body[0].la, e.N, "anonymous");
  };
  e.O = e.i(r, !0), e.g(t, "Function", e.O, y), e.g(e.O, "prototype", e.Z, y), e.g(e.Z, "constructor", e.O, y), e.Z.Ta = function() {
  }, e.Z.Ta.id = e.Ya++, e.Z.Ab = !0, e.g(e.Z, "length", 0, X), e.Z.H = "Function", r = function(o, s) {
    var a = e.o[e.o.length - 1];
    a.U = this, a.B = o, a.F = [], s != null && (s instanceof A ? a.F = qr(e, s) : m(e, e.j, "CreateListFromArrayLike called on non-object")), a.eb = !1;
  }, F(e, e.O, "apply", r), r = function(o) {
    var s = e.o[e.o.length - 1];
    s.U = this, s.B = o, s.F = [];
    for (var a = 1; a < arguments.length; a++)
      s.F.push(arguments[a]);
    s.eb = !1;
  }, F(e, e.O, "call", r), e.ba.push("Object.defineProperty(Function.prototype, 'bind',", "{configurable: true, writable: true, value:", "function bind(oThis) {", "if (typeof this !== 'function') {", "throw TypeError('What is trying to be bound is not callable');", "}", "var aArgs   = Array.prototype.slice.call(arguments, 1),", "fToBind = this,", "fNOP    = function() {},", "fBound  = function() {", "return fToBind.apply(this instanceof fNOP", "? this", ": oThis,", "aArgs.concat(Array.prototype.slice.call(arguments)));", "};", "if (this.prototype) {", "fNOP.prototype = this.prototype;", "}", "fBound.prototype = new fNOP();", "return fBound;", "}", "});", ""), r = function() {
    return String(this);
  }, F(e, e.O, "toString", r), e.g(e.O, "toString", e.i(r, !1), y), r = function() {
    return this.valueOf();
  }, F(e, e.O, "valueOf", r), e.g(e.O, "valueOf", e.i(r, !1), y);
}
function Un(e, t) {
  function n(o) {
    o != null || m(e, e.j, "Cannot convert '" + o + "' to object");
  }
  var r = function(o) {
    if (o == null)
      return ae(e) ? this : e.s(e.M);
    if (!(o instanceof A)) {
      var s = e.s(se(e, o));
      return s.data = o, s;
    }
    return o;
  };
  e.v = e.i(r, !0), e.g(e.v, "prototype", e.M, y), e.g(e.M, "constructor", e.v, y), e.g(t, "Object", e.v, y), r = function(o) {
    return n(o), oe(e, Object.getOwnPropertyNames(o instanceof A ? o.h : o));
  }, e.g(e.v, "getOwnPropertyNames", e.i(r, !1), y), r = function(o) {
    return n(o), o instanceof A && (o = o.h), oe(e, Object.keys(o));
  }, e.g(e.v, "keys", e.i(r, !1), y), r = function(o) {
    return o === null ? e.s(null) : (o instanceof A || m(e, e.j, "Object prototype may only be an Object or null, not " + o), e.s(o));
  }, e.g(e.v, "create", e.i(r, !1), y), e.ba.push("(function() {", "var create_ = Object.create;", "Object.create = function create(proto, props) {", "var obj = create_(proto);", "props && Object.defineProperties(obj, props);", "return obj;", "};", "})();", ""), r = function(o, s, a) {
    return s = String(s), o instanceof A || m(e, e.j, "Object.defineProperty called on non-object: " + o), a instanceof A || m(e, e.j, "Property description must be an object"), !o.preventExtensions || s in o.h || m(e, e.j, "Can't define property '" + s + "', object is not extensible"), e.g(o, s, Ke, a.h), o;
  }, e.g(e.v, "defineProperty", e.i(r, !1), y), e.ba.push("(function() {", "var defineProperty_ = Object.defineProperty;", "Object.defineProperty = function defineProperty(obj, prop, d1) {", "var d2 = {};", "if ('configurable' in d1) d2.configurable = d1.configurable;", "if ('enumerable' in d1) d2.enumerable = d1.enumerable;", "if ('writable' in d1) d2.writable = d1.writable;", "if ('value' in d1) d2.value = d1.value;", "if ('get' in d1) d2.get = d1.get;", "if ('set' in d1) d2.set = d1.set;", "return defineProperty_(obj, prop, d2);", "};", "})();", "Object.defineProperty(Object, 'defineProperties',", "{configurable: true, writable: true, value:", "function defineProperties(obj, props) {", "var keys = Object.keys(props);", "for (var i = 0; i < keys.length; i++) {", "Object.defineProperty(obj, keys[i], props[keys[i]]);", "}", "return obj;", "}", "});", ""), r = function(o, s) {
    if (o instanceof A || m(e, e.j, "Object.getOwnPropertyDescriptor called on non-object: " + o), s = String(s), s in o.h) {
      var a = Object.getOwnPropertyDescriptor(o.h, s), f = o.V[s];
      return o = o.Y[s], s = e.s(e.M), f || o ? (e.g(s, "get", f), e.g(s, "set", o)) : (e.g(s, "value", a.value), e.g(s, "writable", a.writable)), e.g(s, "configurable", a.configurable), e.g(s, "enumerable", a.enumerable), s;
    }
  }, e.g(e.v, "getOwnPropertyDescriptor", e.i(r, !1), y), r = function(o) {
    return n(o), se(e, o);
  }, e.g(e.v, "getPrototypeOf", e.i(r, !1), y), r = function(o) {
    return !!o && !o.preventExtensions;
  }, e.g(e.v, "isExtensible", e.i(r, !1), y), r = function(o) {
    return o instanceof A && (o.preventExtensions = !0), o;
  }, e.g(e.v, "preventExtensions", e.i(r, !1), y), F(e, e.v, "toString", A.prototype.toString), F(e, e.v, "toLocaleString", A.prototype.toString), F(e, e.v, "valueOf", A.prototype.valueOf), r = function(o) {
    return n(this), this instanceof A ? String(o) in this.h : this.hasOwnProperty(o);
  }, F(e, e.v, "hasOwnProperty", r), r = function(o) {
    return n(this), this instanceof A ? Object.prototype.propertyIsEnumerable.call(this.h, o) : this.propertyIsEnumerable(o);
  }, F(e, e.v, "propertyIsEnumerable", r), r = function(o) {
    for (; ; ) {
      if (o = se(e, o), !o)
        return !1;
      if (o === this)
        return !0;
    }
  }, F(e, e.v, "isPrototypeOf", r);
}
function Fn(e, t) {
  var n = function(r) {
    var o = ae(e) ? this : Ae(e), s = arguments[0];
    if (arguments.length === 1 && typeof s == "number")
      isNaN(Gt(s)) && m(e, e.ob, "Invalid array length: " + s), o.h.length = s;
    else {
      for (s = 0; s < arguments.length; s++)
        o.h[s] = arguments[s];
      o.h.length = s;
    }
    return o;
  };
  e.qa = e.i(n, !0), e.La = e.qa.h.prototype, e.g(t, "Array", e.qa, y), n = function(r) {
    return r && r.H === "Array";
  }, e.g(e.qa, "isArray", e.i(n, !1), y), e.g(e.La, "length", 0, {
    configurable: !1,
    enumerable: !1,
    writable: !0
  }), e.La.H = "Array", e.ba.push("(function() {", "function createArrayMethod_(f) {", "Object.defineProperty(Array.prototype, f.name,", "{configurable: true, writable: true, value: f});", "}", "createArrayMethod_(", "function pop() {", "if (!this) throw TypeError();", "var o = Object(this), len = o.length >>> 0;", "if (!len || len < 0) {", "o.length = 0;", "return undefined;", "}", "len--;", "var x = o[len];", "delete o[len];", "o.length = len;", "return x;", "}", ");", "createArrayMethod_(", "function push(var_args) {", "if (!this) throw TypeError();", "var o = Object(this), len = o.length >>> 0;", "for (var i = 0; i < arguments.length; i++) {", "o[len] = arguments[i];", "len++;", "}", "o.length = len;", "return len;", "}", ");", "createArrayMethod_(", "function shift() {", "if (!this) throw TypeError();", "var o = Object(this), len = o.length >>> 0;", "if (!len || len < 0) {", "o.length = 0;", "return undefined;", "}", "var value = o[0];", "for (var i = 0; i < len - 1; i++) {", "if ((i + 1) in o) {", "o[i] = o[i + 1];", "} else {", "delete o[i];", "}", "}", "delete o[i];", "o.length = len - 1;", "return value;", "}", ");", "createArrayMethod_(", "function unshift(var_args) {", "if (!this) throw TypeError();", "var o = Object(this), len = o.length >>> 0;", "if (!len || len < 0) {", "len = 0;", "}", "for (var i = len - 1; i >= 0; i--) {", "if (i in o) {", "o[i + arguments.length] = o[i];", "} else {", "delete o[i + arguments.length];", "}", "}", "for (var i = 0; i < arguments.length; i++) {", "o[i] = arguments[i];", "}", "return (o.length = len + arguments.length);", "}", ");", "createArrayMethod_(", "function reverse() {", "if (!this) throw TypeError();", "var o = Object(this), len = o.length >>> 0;", "if (!len || len < 2) {", "return o;", "}", "for (var i = 0; i < len / 2 - 0.5; i++) {", "var x = o[i];", "var hasX = i in o;", "if ((len - i - 1) in o) {", "o[i] = o[len - i - 1];", "} else {", "delete o[i];", "}", "if (hasX) {", "o[len - i - 1] = x;", "} else {", "delete o[len - i - 1];", "}", "}", "return o;", "}", ");", "createArrayMethod_(", "function indexOf(searchElement, fromIndex) {", "if (!this) throw TypeError();", "var o = Object(this), len = o.length >>> 0;", "var n = fromIndex | 0;", "if (!len || n >= len) {", "return -1;", "}", "var i = Math.max(n >= 0 ? n : len - Math.abs(n), 0);", "while (i < len) {", "if (i in o && o[i] === searchElement) {", "return i;", "}", "i++;", "}", "return -1;", "}", ");", "createArrayMethod_(", "function lastIndexOf(searchElement, fromIndex) {", "if (!this) throw TypeError();", "var o = Object(this), len = o.length >>> 0;", "if (!len) {", "return -1;", "}", "var n = len - 1;", "if (arguments.length > 1) {", "n = fromIndex | 0;", "if (n) {", "n = (n > 0 || -1) * Math.floor(Math.abs(n));", "}", "}", "var i = n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n);", "while (i >= 0) {", "if (i in o && o[i] === searchElement) {", "return i;", "}", "i--;", "}", "return -1;", "}", ");", "createArrayMethod_(", "function slice(start, end) {", "if (!this) throw TypeError();", "var o = Object(this), len = o.length >>> 0;", "start |= 0;", "start = (start >= 0) ? start : Math.max(0, len + start);", "if (typeof end !== 'undefined') {", "if (end !== Infinity) {", "end |= 0;", "}", "if (end < 0) {", "end = len + end;", "} else {", "end = Math.min(end, len);", "}", "} else {", "end = len;", "}", "var size = end - start;", "var cloned = new Array(size);", "for (var i = 0; i < size; i++) {", "if ((start + i) in o) {", "cloned[i] = o[start + i];", "}", "}", "return cloned;", "}", ");", "createArrayMethod_(", "function splice(start, deleteCount, var_args) {", "if (!this) throw TypeError();", "var o = Object(this), len = o.length >>> 0;", "start |= 0;", "if (start < 0) {", "start = Math.max(len + start, 0);", "} else {", "start = Math.min(start, len);", "}", "if (arguments.length < 1) {", "deleteCount = len - start;", "} else {", "deleteCount |= 0;", "deleteCount = Math.max(0, Math.min(deleteCount, len - start));", "}", "var removed = [];", "for (var i = start; i < start + deleteCount; i++) {", "if (i in o) {", "removed.push(o[i]);", "} else {", "removed.length++;", "}", "if ((i + deleteCount) in o) {", "o[i] = o[i + deleteCount];", "} else {", "delete o[i];", "}", "}", "for (var i = start + deleteCount; i < len - deleteCount; i++) {", "if ((i + deleteCount) in o) {", "o[i] = o[i + deleteCount];", "} else {", "delete o[i];", "}", "}", "for (var i = len - deleteCount; i < len; i++) {", "delete o[i];", "}", "len -= deleteCount;", "var arl = arguments.length - 2;", "for (var i = len - 1; i >= start; i--) {", "if (i in o) {", "o[i + arl] = o[i];", "} else {", "delete o[i + arl];", "}", "}", "len += arl;", "for (var i = 2; i < arguments.length; i++) {", "o[start + i - 2] = arguments[i];", "}", "o.length = len;", "return removed;", "}", ");", "createArrayMethod_(", "function concat(var_args) {", "if (!this) throw TypeError();", "var o = Object(this);", "var cloned = [];", "for (var i = -1; i < arguments.length; i++) {", "var value = (i === -1) ? o : arguments[i];", "if (Array.isArray(value)) {", "for (var j = 0, l = value.length; j < l; j++) {", "if (j in value) {", "cloned.push(value[j]);", "} else {", "cloned.length++;", "}", "}", "} else {", "cloned.push(value);", "}", "}", "return cloned;", "}", ");", "createArrayMethod_(", "function join(opt_separator) {", "if (!this) throw TypeError();", "var o = Object(this), len = o.length >>> 0;", "var sep = typeof opt_separator === 'undefined' ?", "',' : ('' + opt_separator);", "var str = '';", "for (var i = 0; i < len; i++) {", "if (i && sep) str += sep;", "str += (o[i] === null || o[i] === undefined) ? '' : o[i];", "}", "return str;", "}", ");", "createArrayMethod_(", "function every(callbackfn, thisArg) {", "if (!this || typeof callbackfn !== 'function') throw TypeError();", "var t, k = 0;", "var o = Object(this), len = o.length >>> 0;", "if (arguments.length > 1) t = thisArg;", "while (k < len) {", "if (k in o && !callbackfn.call(t, o[k], k, o)) return false;", "k++;", "}", "return true;", "}", ");", "createArrayMethod_(", "function filter(fun, var_args) {", "if (this === void 0 || this === null || typeof fun !== 'function') throw TypeError();", "var o = Object(this), len = o.length >>> 0;", "var res = [];", "var thisArg = arguments.length >= 2 ? arguments[1] : void 0;", "for (var i = 0; i < len; i++) {", "if (i in o) {", "var val = o[i];", "if (fun.call(thisArg, val, i, o)) res.push(val);", "}", "}", "return res;", "}", ");", "createArrayMethod_(", "function forEach(callback, thisArg) {", "if (!this || typeof callback !== 'function') throw TypeError();", "var t, k = 0;", "var o = Object(this), len = o.length >>> 0;", "if (arguments.length > 1) t = thisArg;", "while (k < len) {", "if (k in o) callback.call(t, o[k], k, o);", "k++;", "}", "}", ");", "createArrayMethod_(", "function map(callback, thisArg) {", "if (!this || typeof callback !== 'function') throw TypeError();", "var t, k = 0;", "var o = Object(this), len = o.length >>> 0;", "if (arguments.length > 1) t = thisArg;", "var a = new Array(len);", "while (k < len) {", "if (k in o) a[k] = callback.call(t, o[k], k, o);", "k++;", "}", "return a;", "}", ");", "createArrayMethod_(", "function reduce(callback /*, initialValue*/) {", "if (!this || typeof callback !== 'function') throw TypeError();", "var o = Object(this), len = o.length >>> 0;", "var k = 0, value;", "if (arguments.length === 2) {", "value = arguments[1];", "} else {", "while (k < len && !(k in o)) k++;", "if (k >= len) {", "throw TypeError('Reduce of empty array with no initial value');", "}", "value = o[k++];", "}", "for (; k < len; k++) {", "if (k in o) value = callback(value, o[k], k, o);", "}", "return value;", "}", ");", "createArrayMethod_(", "function reduceRight(callback /*, initialValue*/) {", "if (null === this || 'undefined' === typeof this || 'function' !== typeof callback) throw TypeError();", "var o = Object(this), len = o.length >>> 0;", "var k = len - 1, value;", "if (arguments.length >= 2) {", "value = arguments[1];", "} else {", "while (k >= 0 && !(k in o)) k--;", "if (k < 0) {", "throw TypeError('Reduce of empty array with no initial value');", "}", "value = o[k--];", "}", "for (; k >= 0; k--) {", "if (k in o) value = callback(value, o[k], k, o);", "}", "return value;", "}", ");", "createArrayMethod_(", "function some(fun/*, thisArg*/) {", "if (!this || typeof fun !== 'function') throw TypeError();", "var o = Object(this), len = o.length >>> 0;", "var thisArg = arguments.length >= 2 ? arguments[1] : void 0;", "for (var i = 0; i < len; i++) {", "if (i in o && fun.call(thisArg, o[i], i, o)) return true;", "}", "return false;", "}", ");", "createArrayMethod_(", "function sort(opt_comp) {", "if (!this) throw TypeError();", "if (typeof opt_comp !== 'function') {", "opt_comp = undefined;", "}", "for (var i = 0; i < this.length; i++) {", "var changes = 0;", "for (var j = 0; j < this.length - i - 1; j++) {", "if (opt_comp ? (opt_comp(this[j], this[j + 1]) > 0) :", "(String(this[j]) > String(this[j + 1]))) {", "var swap = this[j];", "var hasSwap = j in this;", "if ((j + 1) in this) {", "this[j] = this[j + 1];", "} else {", "delete this[j];", "}", "if (hasSwap) {", "this[j + 1] = swap;", "} else {", "delete this[j + 1];", "}", "changes++;", "}", "}", "if (!changes) break;", "}", "return this;", "}", ");", "createArrayMethod_(", "function toLocaleString() {", "if (!this) throw TypeError();", "var o = Object(this), len = o.length >>> 0;", "var out = [];", "for (var i = 0; i < len; i++) {", "out[i] = (o[i] === null || o[i] === undefined) ? '' : o[i].toLocaleString();", "}", "return out.join(',');", "}", ");", "})();", "");
}
function Ln(e, t) {
  var n = function(r) {
    return r = arguments.length ? fe.String(r) : "", ae(e) ? (this.data = r, this) : r;
  };
  for (e.J = e.i(n, !0), e.g(t, "String", e.J, y), e.g(e.J, "fromCharCode", e.i(String.fromCharCode, !1), y), t = "charAt charCodeAt concat indexOf lastIndexOf slice substr substring toLocaleLowerCase toLocaleUpperCase toLowerCase toUpperCase trim".split(" "), n = 0; n < t.length; n++)
    F(e, e.J, t[n], String.prototype[t[n]]);
  n = function(r, o, s) {
    o = e.R(o), s = e.R(s);
    try {
      return String(this).localeCompare(r, o, s);
    } catch (a) {
      m(e, e.D, "localeCompare: " + a.message);
    }
  }, F(e, e.J, "localeCompare", n), n = function(r, o, s) {
    var a = String(this);
    if (o = o ? Number(o) : void 0, _(e, r, e.I) && (r = r.data, We(e, r, s), e.REGEXP_MODE === 2)) {
      if (ie)
        r = _e(e, "string.split(separator, limit)", {
          string: a,
          separator: r,
          limit: o
        }, r, s), r !== Ce && s(oe(e, r));
      else {
        var f = e.ha(), g = $e(e, r, f, s);
        f.onmessage = function(C) {
          clearTimeout(g), s(oe(e, C.data));
        }, f.postMessage(["split", a, r, o]);
      }
      return;
    }
    r = a.split(r, o), s(oe(e, r));
  }, Ge(e, e.J, "split", n), n = function(r, o) {
    var s = String(this);
    if (r = _(e, r, e.I) ? r.data : new RegExp(r), We(e, r, o), e.REGEXP_MODE === 2)
      if (ie)
        r = _e(e, "string.match(regexp)", {
          string: s,
          regexp: r
        }, r, o), r !== Ce && o(r && oe(e, r));
      else {
        var a = e.ha(), f = $e(e, r, a, o);
        a.onmessage = function(g) {
          clearTimeout(f), o(g.data && oe(e, g.data));
        }, a.postMessage(["match", s, r]);
      }
    else
      r = s.match(r), o(r && oe(e, r));
  }, Ge(e, e.J, "match", n), n = function(r, o) {
    var s = String(this);
    if (_(e, r, e.I) ? r = r.data : r = new RegExp(r), We(e, r, o), e.REGEXP_MODE === 2)
      if (ie)
        r = _e(e, "string.search(regexp)", {
          string: s,
          regexp: r
        }, r, o), r !== Ce && o(r);
      else {
        var a = e.ha(), f = $e(e, r, a, o);
        a.onmessage = function(g) {
          clearTimeout(f), o(g.data);
        }, a.postMessage(["search", s, r]);
      }
    else
      o(s.search(r));
  }, Ge(e, e.J, "search", n), n = function(r, o, s) {
    var a = String(this);
    if (o = String(o), _(e, r, e.I) && (r = r.data, We(e, r, s), e.REGEXP_MODE === 2)) {
      if (ie)
        r = _e(e, "string.replace(substr, newSubstr)", {
          string: a,
          substr: r,
          newSubstr: o
        }, r, s), r !== Ce && s(r);
      else {
        var f = e.ha(), g = $e(e, r, f, s);
        f.onmessage = function(C) {
          clearTimeout(g), s(C.data);
        }, f.postMessage(["replace", a, r, o]);
      }
      return;
    }
    s(a.replace(r, o));
  }, Ge(e, e.J, "replace", n), e.ba.push("(function() {", "var replace_ = String.prototype.replace;", "String.prototype.replace = function replace(substr, newSubstr) {", "if (typeof newSubstr !== 'function') {", "return replace_.call(this, substr, newSubstr);", "}", "var str = this;", "if (substr instanceof RegExp) {", "var subs = [];", "var m = substr.exec(str);", "while (m) {", "m.push(m.index, str);", "var inject = newSubstr.apply(null, m);", "subs.push([m.index, m[0].length, inject]);", "m = substr.global ? substr.exec(str) : null;", "}", "for (var i = subs.length - 1; i >= 0; i--) {", "str = str.substring(0, subs[i][0]) + subs[i][2] + str.substring(subs[i][0] + subs[i][1]);", "}", "} else {", "var i = str.indexOf(substr);", "if (i !== -1) {", "var inject = newSubstr(str.substr(i, substr.length), i, str);", "str = str.substring(0, i) + inject + str.substring(i + substr.length);", "}", "}", "return str;", "};", "})();", "");
}
function _n(e, t) {
  e.mb = e.i(function(n) {
    return n = fe.Boolean(n), ae(e) ? (this.data = n, this) : n;
  }, !0), e.g(t, "Boolean", e.mb, y);
}
function Wn(e, t) {
  var n = function(r) {
    return r = arguments.length ? fe.Number(r) : 0, ae(e) ? (this.data = r, this) : r;
  };
  for (e.aa = e.i(n, !0), e.g(t, "Number", e.aa, y), t = ["MAX_VALUE", "MIN_VALUE", "NaN", "NEGATIVE_INFINITY", "POSITIVE_INFINITY"], n = 0; n < t.length; n++)
    e.g(e.aa, t[n], Number[t[n]], Le);
  n = function(r) {
    try {
      return Number(this).toExponential(r);
    } catch (o) {
      m(e, e.D, o.message);
    }
  }, F(e, e.aa, "toExponential", n), n = function(r) {
    try {
      return Number(this).toFixed(r);
    } catch (o) {
      m(e, e.D, o.message);
    }
  }, F(e, e.aa, "toFixed", n), n = function(r) {
    try {
      return Number(this).toPrecision(r);
    } catch (o) {
      m(e, e.D, o.message);
    }
  }, F(e, e.aa, "toPrecision", n), n = function(r) {
    try {
      return Number(this).toString(r);
    } catch (o) {
      m(e, e.D, o.message);
    }
  }, F(e, e.aa, "toString", n), n = function(r, o) {
    r = r ? e.R(r) : void 0, o = o ? e.R(o) : void 0;
    try {
      return Number(this).toLocaleString(r, o);
    } catch (s) {
      m(e, e.D, "toLocaleString: " + s.message);
    }
  }, F(e, e.aa, "toLocaleString", n);
}
function $n(e, t) {
  var n = function(o, s) {
    if (!ae(e))
      return fe.Date();
    var a = [null].concat(Array.from(arguments));
    return this.data = new (Function.prototype.bind.apply(fe.Date, a))(), this;
  };
  e.$ = e.i(n, !0), e.nb = e.$.h.prototype, e.g(t, "Date", e.$, y), e.g(e.$, "now", e.i(Date.now, !1), y), e.g(e.$, "parse", e.i(Date.parse, !1), y), e.g(e.$, "UTC", e.i(Date.UTC, !1), y), t = "getDate getDay getFullYear getHours getMilliseconds getMinutes getMonth getSeconds getTime getTimezoneOffset getUTCDate getUTCDay getUTCFullYear getUTCHours getUTCMilliseconds getUTCMinutes getUTCMonth getUTCSeconds getYear setDate setFullYear setHours setMilliseconds setMinutes setMonth setSeconds setTime setUTCDate setUTCFullYear setUTCHours setUTCMilliseconds setUTCMinutes setUTCMonth setUTCSeconds setYear toDateString toISOString toJSON toGMTString toLocaleDateString toLocaleString toLocaleTimeString toTimeString toUTCString".split(" ");
  for (var r = 0; r < t.length; r++)
    n = function(o) {
      return function(s) {
        var a = this.data;
        a instanceof Date || m(e, e.j, o + " not called on a Date");
        for (var f = [], g = 0; g < arguments.length; g++)
          f[g] = e.R(arguments[g]);
        return a[o].apply(a, f);
      };
    }(t[r]), F(e, e.$, t[r], n);
}
function Gn(e, t) {
  var n = function(r, o) {
    if (ae(e))
      var s = this;
    else {
      if (o === void 0 && _(e, r, e.I))
        return r;
      s = e.s(e.Ma);
    }
    r = r === void 0 ? "" : String(r), o = o ? String(o) : "", /^[gmi]*$/.test(o) || m(e, e.T, "Invalid regexp flag: " + o);
    try {
      var a = new fe.RegExp(r, o);
    } catch (f) {
      m(e, e.T, f.message);
    }
    return Vt(e, s, a), s;
  };
  e.I = e.i(n, !0), e.Ma = e.I.h.prototype, e.g(t, "RegExp", e.I, y), e.g(e.I.h.prototype, "global", void 0, X), e.g(e.I.h.prototype, "ignoreCase", void 0, X), e.g(e.I.h.prototype, "multiline", void 0, X), e.g(e.I.h.prototype, "source", "(?:)", X), e.ba.push("Object.defineProperty(RegExp.prototype, 'test',", "{configurable: true, writable: true, value:", "function test(str) {", "return !!this.exec(str);", "}", "});"), n = function(r, o) {
    function s(j) {
      if (j) {
        var S = oe(e, j);
        return e.g(S, "index", j.index), e.g(S, "input", j.input), S;
      }
      return null;
    }
    var a = this.data;
    if (r = String(r), a.lastIndex = Number(e.G(this, "lastIndex")), We(e, a, o), e.REGEXP_MODE === 2)
      if (ie)
        r = _e(e, "regexp.exec(string)", {
          string: r,
          regexp: a
        }, a, o), r !== Ce && (e.g(this, "lastIndex", a.lastIndex), o(s(r)));
      else {
        var f = e.ha(), g = $e(e, a, f, o), C = this;
        f.onmessage = function(j) {
          clearTimeout(g), e.g(C, "lastIndex", j.data[1]), o(s(j.data[0]));
        }, f.postMessage(["exec", a, a.lastIndex, r]);
      }
    else
      r = a.exec(r), e.g(this, "lastIndex", a.lastIndex), o(s(r));
  }, Ge(e, e.I, "exec", n);
}
function Vn(e, t) {
  function n(r) {
    var o = e.i(function(s) {
      var a = ae(e) ? this : e.Aa(o);
      return _t(e, a, s), a;
    }, !0);
    return e.g(o, "prototype", e.Aa(e.D), y), e.g(o.h.prototype, "name", r, y), e.g(t, r, o, y), o;
  }
  e.D = e.i(function(r) {
    var o = ae(e) ? this : e.Aa(e.D);
    return _t(e, o, r), o;
  }, !0), e.g(t, "Error", e.D, y), e.g(e.D.h.prototype, "message", "", y), e.g(e.D.h.prototype, "name", "Error", y), n("EvalError"), e.ob = n("RangeError"), e.pb = n("ReferenceError"), e.T = n("SyntaxError"), e.j = n("TypeError"), e.Gb = n("URIError");
}
function Hn(e, t) {
  var n = e.s(e.M);
  e.g(t, "Math", n, y);
  var r = "E LN2 LN10 LOG2E LOG10E PI SQRT1_2 SQRT2".split(" ");
  for (t = 0; t < r.length; t++)
    e.g(n, r[t], Math[r[t]], X);
  for (r = "abs acos asin atan atan2 ceil cos exp floor log max min pow random round sin sqrt tan".split(" "), t = 0; t < r.length; t++)
    e.g(n, r[t], e.i(Math[r[t]], !1), y);
}
function Xn(e, t) {
  var n = e.s(e.M);
  e.g(t, "JSON", n, y), t = function(r) {
    try {
      var o = JSON.parse(String(r));
    } catch (s) {
      m(e, e.T, s.message);
    }
    return e.Ia(o);
  }, e.g(n, "parse", e.i(t, !1)), t = function(r, o, s) {
    o && o.H === "Function" ? m(e, e.j, "Function replacer on JSON.stringify not supported") : o && o.H === "Array" ? (o = qr(e, o), o = o.filter(function(f) {
      return typeof f == "string" || typeof f == "number";
    })) : o = null, typeof s != "string" && typeof s != "number" && (s = void 0), r = e.R(r);
    try {
      var a = JSON.stringify(r, o, s);
    } catch (f) {
      m(e, e.j, f.message);
    }
    return a;
  }, e.g(n, "stringify", e.i(t, !1));
}
function _(e, t, n) {
  if (t == null || !n)
    return !1;
  if (n = n.h.prototype, t === n)
    return !0;
  for (t = se(e, t); t; ) {
    if (t === n)
      return !0;
    t = t.xa;
  }
  return !1;
}
function Vt(e, t, n) {
  t.data = new RegExp(n.source, n.flags), e.g(t, "lastIndex", n.lastIndex, y), e.g(t, "source", n.source, X), e.g(t, "global", n.global, X), e.g(t, "ignoreCase", n.ignoreCase, X), e.g(t, "multiline", n.multiline, X);
}
function _t(e, t, n) {
  n && e.g(t, "message", String(n), y), n = [];
  for (var r = e.o.length - 1; 0 <= r; r--) {
    var o = e.o[r], s = o.node;
    s.type === "CallExpression" && (o = o.U) && n.length && (n[n.length - 1].Ob = e.G(o, "name")), !s.X || n.length && s.type !== "CallExpression" || n.push({
      Nb: s.X
    });
  }
  for (r = String(e.G(t, "name")), s = String(e.G(t, "message")), s = r + ": " + s + `
`, r = 0; r < n.length; r++) {
    var a = n[r].Nb;
    o = n[r].Ob, a = a.source + ":" + a.start.line + ":" + a.start.ab, s = o ? s + ("  at " + o + " (" + a + `)
`) : s + ("  at " + a + `
`);
  }
  e.g(t, "stack", s.trim(), y);
}
T.ha = function() {
  var e = this.ha.Mb;
  return e || (e = new Blob([Mn.join(`
`)], {
    type: "application/javascript"
  }), this.ha.Mb = e), new Worker(URL.createObjectURL(e));
};
function _e(e, t, n, r, o) {
  var s = {
    timeout: e.REGEXP_THREAD_TIMEOUT
  };
  try {
    return ie.runInNewContext(t, n, s);
  } catch {
    o(null), m(e, e.D, "RegExp Timeout: " + r);
  }
  return Ce;
}
function We(e, t, n) {
  if (e.REGEXP_MODE === 0)
    var r = !1;
  else if (e.REGEXP_MODE === 1)
    r = !0;
  else if (ie)
    r = !0;
  else if (typeof Worker == "function" && typeof URL == "function")
    r = !0;
  else if (typeof require == "function") {
    try {
      ie = require("vm");
    } catch {
    }
    r = !!ie;
  } else
    r = !1;
  r || (n(null), m(e, e.D, "Regular expressions not supported: " + t));
}
function $e(e, t, n, r) {
  return setTimeout(function() {
    n.terminate(), r(null);
    try {
      m(e, e.D, "RegExp Timeout: " + t);
    } catch {
    }
  }, e.REGEXP_THREAD_TIMEOUT);
}
T.Aa = function(e) {
  return this.s(e && e.h.prototype);
};
T.s = function(e) {
  if (typeof e != "object")
    throw Error("Non object prototype");
  return e = new A(e), _(this, e, this.D) && (e.H = "Error"), e;
};
function Ae(e) {
  var t = e.s(e.La);
  return e.g(t, "length", 0, {
    configurable: !1,
    enumerable: !1,
    writable: !0
  }), t.H = "Array", t;
}
function Ht(e, t, n) {
  var r = e.s(e.Z);
  return n ? (n = e.s(e.M), e.g(r, "prototype", n, y), e.g(n, "constructor", r, y)) : r.Ab = !0, e.g(r, "length", t, X), r.H = "Function", r;
}
function Xt(e, t, n, r) {
  var o = Ht(e, t.oa.length, !0);
  return o.Va = n, o.node = t, e.g(o, "name", t.id ? String(t.id.name) : r || "", X), o;
}
T.i = function(e, t) {
  return t = Ht(this, e.length, t), t.Ta = e, e.id = this.Ya++, this.g(t, "name", e.name, X), t;
};
T.ub = function(e) {
  var t = Ht(this, e.length, !0);
  return t.Za = e, e.id = this.Ya++, this.g(t, "name", e.name, X), t;
};
T.Ia = function(e) {
  if (e instanceof A)
    throw Error("Object is already pseudo");
  if (e == null || e === !0 || e === !1 || typeof e == "string" || typeof e == "number")
    return e;
  if (e instanceof RegExp) {
    var t = this.s(this.Ma);
    return Vt(this, t, e), t;
  }
  if (e instanceof Date)
    return t = this.s(this.nb), t.data = new Date(e.valueOf()), t;
  if (typeof e == "function") {
    var n = this;
    return t = Object.getOwnPropertyDescriptor(e, "prototype"), this.i(function() {
      var o = Array.prototype.slice.call(arguments).map(function(s) {
        return n.R(s);
      });
      return o = e.apply(n, o), n.Ia(o);
    }, !!t);
  }
  if (Array.isArray(e)) {
    t = Ae(this);
    for (var r = 0; r < e.length; r++)
      r in e && this.g(t, r, this.Ia(e[r]));
    return t;
  }
  t = this.s(this.M);
  for (r in e)
    this.g(t, r, this.Ia(e[r]));
  return t;
};
T.R = function(e, t) {
  if (typeof e != "object" && typeof e != "function" || e === null)
    return e;
  if (!(e instanceof A))
    throw Error("Object is not pseudo");
  if (_(this, e, this.I))
    return t = new RegExp(e.data.source, e.data.flags), t.lastIndex = e.data.lastIndex, t;
  if (_(this, e, this.$))
    return new Date(e.data.valueOf());
  t = t || {
    hb: [],
    Sa: []
  };
  var n = t.hb.indexOf(e);
  if (n !== -1)
    return t.Sa[n];
  if (t.hb.push(e), _(this, e, this.qa)) {
    n = [], t.Sa.push(n);
    for (var r = this.G(e, "length"), o = 0; o < r; o++)
      lt(this, e, o) && (n[o] = this.R(this.G(e, o), t));
  } else
    for (r in n = {}, t.Sa.push(n), e.h)
      o = this.R(e.h[r], t), Object.defineProperty(n, r, {
        value: o,
        writable: !0,
        enumerable: !0,
        configurable: !0
      });
  return t.hb.pop(), t.Sa.pop(), n;
};
function oe(e, t) {
  for (var n = Ae(e), r = Object.getOwnPropertyNames(t), o = 0; o < r.length; o++)
    e.g(n, r[o], t[r[o]]);
  return n;
}
function qr(e, t) {
  var n = [], r;
  for (r in t.h)
    n[r] = e.G(t, r);
  return n.length = Gt(e.G(t, "length")) || 0, n;
}
function se(e, t) {
  switch (typeof t) {
    case "number":
      return e.aa.h.prototype;
    case "boolean":
      return e.mb.h.prototype;
    case "string":
      return e.J.h.prototype;
  }
  return t ? t.xa : null;
}
T.G = function(e, t) {
  if (this.P)
    throw Error("Getter not supported in that context");
  if (t = String(t), e != null || m(this, this.j, "Cannot read property '" + t + "' of " + e), typeof e == "object" && !(e instanceof A))
    throw TypeError("Expecting native value or pseudo object");
  if (t === "length") {
    if (_(this, e, this.J))
      return String(e).length;
  } else if (64 > t.charCodeAt(0) && _(this, e, this.J)) {
    var n = He(t);
    if (!isNaN(n) && n < String(e).length)
      return String(e)[n];
  }
  do
    if (e.h && t in e.h)
      return (n = e.V[t]) ? (this.P = !0, n) : e.h[t];
  while (e = se(this, e));
};
function lt(e, t, n) {
  if (!(t instanceof A))
    throw TypeError("Primitive data type has no properties");
  if (n = String(n), n === "length" && _(e, t, e.J))
    return !0;
  if (_(e, t, e.J)) {
    var r = He(n);
    if (!isNaN(r) && r < String(t).length)
      return !0;
  }
  do
    if (t.h && n in t.h)
      return !0;
  while (t = se(e, t));
  return !1;
}
T.g = function(e, t, n, r) {
  if (this.Ka)
    throw Error("Setter not supported in that context");
  if (t = String(t), e != null || m(this, this.j, "Cannot set property '" + t + "' of " + e), typeof e == "object" && !(e instanceof A))
    throw TypeError("Expecting native value or pseudo object");
  r && ("get" in r || "set" in r) && ("value" in r || "writable" in r) && m(this, this.j, "Invalid property descriptor. Cannot both specify accessors and a value or writable attribute");
  var o = !this.o || Kt(this).S;
  if (e instanceof A) {
    if (_(this, e, this.J)) {
      var s = He(t);
      if (t === "length" || !isNaN(s) && s < String(e).length) {
        o && m(this, this.j, "Cannot assign to read only property '" + t + "' of String '" + e.data + "'");
        return;
      }
    }
    if (e.H === "Array")
      if (s = e.h.length, t === "length") {
        if (r) {
          if (!("value" in r))
            return;
          n = r.value;
        }
        if (n = Gt(n), isNaN(n) && m(this, this.ob, "Invalid array length"), n < s)
          for (a in e.h) {
            var a = He(a);
            !isNaN(a) && n <= a && delete e.h[a];
          }
      } else
        isNaN(a = He(t)) || (e.h.length = Math.max(s, a + 1));
    if (!e.preventExtensions || t in e.h)
      if (r) {
        o = {}, "get" in r && r.get && (e.V[t] = r.get, o.get = this.g.ac), "set" in r && r.set && (e.Y[t] = r.set, o.set = this.g.bc), "configurable" in r && (o.configurable = r.configurable), "enumerable" in r && (o.enumerable = r.enumerable), "writable" in r && (o.writable = r.writable, delete e.V[t], delete e.Y[t]), "value" in r ? (o.value = r.value, delete e.V[t], delete e.Y[t]) : n !== Ke && (o.value = n, delete e.V[t], delete e.Y[t]);
        try {
          Object.defineProperty(e.h, t, o);
        } catch {
          m(this, this.j, "Cannot redefine property: " + t);
        }
        "get" in r && !r.get && delete e.V[t], "set" in r && !r.set && delete e.Y[t];
      } else {
        if (n === Ke)
          throw ReferenceError("Value not specified");
        for (r = e; !(t in r.h); )
          if (r = se(this, r), !r) {
            r = e;
            break;
          }
        if (r.Y && r.Y[t])
          return this.Ka = !0, r.Y[t];
        if (r.V && r.V[t])
          o && m(this, this.j, "Cannot set property '" + t + "' of object '" + e + "' which only has a getter");
        else
          try {
            e.h[t] = n;
          } catch {
            o && m(this, this.j, "Cannot assign to read only property '" + t + "' of object '" + e + "'");
          }
      }
    else
      o && m(this, this.j, "Can't add property '" + t + "', object is not extensible");
  } else
    o && m(this, this.j, "Can't create property '" + t + "' on '" + e + "'");
};
T.g.ac = function() {
  throw Error("Placeholder getter");
};
T.g.bc = function() {
  throw Error("Placeholder setter");
};
function F(e, t, n, r) {
  e.g(t.h.prototype, n, e.i(r, !1), y);
}
function Ge(e, t, n, r) {
  e.g(t.h.prototype, n, e.ub(r), y);
}
function Kt(e) {
  if (e = e.o[e.o.length - 1].scope, !e)
    throw Error("No scope found");
  return e;
}
function Wt(e, t, n) {
  var r = !1;
  if (n && n.S)
    r = !0;
  else {
    var o = t.body && t.body[0];
    o && o.la && o.la.type === "Literal" && o.la.value === "use strict" && (r = !0);
  }
  return o = e.s(null), r = new rn(n, r, o), n || Bn(e, r.object), Je(e, t, r), r;
}
function Jt(e, t, n) {
  if (!t)
    throw Error("parentScope required");
  return e = n || e.s(null), new rn(t, t.S, e);
}
function Yt(e, t) {
  for (var n = Kt(e); n && n !== e.N; ) {
    if (t in n.object.h)
      return n.object.h[t];
    n = n.Va;
  }
  if (n === e.N && lt(e, n.object, t))
    return e.G(n.object, t);
  n = e.o[e.o.length - 1].node, n.type === "UnaryExpression" && n.operator === "typeof" || m(e, e.pb, t + " is not defined");
}
function en(e, t, n) {
  for (var r = Kt(e), o = r.S; r && r !== e.N; ) {
    if (t in r.object.h) {
      try {
        r.object.h[t] = n;
      } catch {
        o && m(e, e.j, "Cannot assign to read only variable '" + t + "'");
      }
      return;
    }
    r = r.Va;
  }
  if (r === e.N && (!o || lt(e, r.object, t)))
    return e.g(r.object, t, n);
  m(e, e.pb, t + " is not defined");
}
function Je(e, t, n) {
  if (t.jb)
    var r = t.jb;
  else {
    switch (r = /* @__PURE__ */ Object.create(null), t.type) {
      case "VariableDeclaration":
        for (var o = 0; o < t.fa.length; o++)
          r[t.fa[o].id.name] = !0;
        break;
      case "FunctionDeclaration":
        r[t.id.name] = t;
        break;
      case "BlockStatement":
      case "CatchClause":
      case "DoWhileStatement":
      case "ForInStatement":
      case "ForStatement":
      case "IfStatement":
      case "LabeledStatement":
      case "Program":
      case "SwitchCase":
      case "SwitchStatement":
      case "TryStatement":
      case "WithStatement":
      case "WhileStatement":
        var s = t.constructor, a;
        for (a in t)
          if (a !== "loc") {
            var f = t[a];
            if (f && typeof f == "object") {
              if (Array.isArray(f)) {
                for (o = 0; o < f.length; o++)
                  if (f[o] && f[o].constructor === s) {
                    var g = Je(e, f[o], n);
                    for (a in g)
                      r[a] = g[a];
                  }
              } else if (f.constructor === s)
                for (a in g = Je(e, f, n), g)
                  r[a] = g[a];
            }
          }
    }
    t.jb = r;
  }
  for (a in r)
    r[a] === !0 ? e.g(n.object, a, void 0, Ur) : e.g(n.object, a, Xt(e, r[a], n), Ur);
  return r;
}
function ae(e) {
  return e.o[e.o.length - 1].isConstructor;
}
function Zt(e, t) {
  return t[0] === be ? Yt(e, t[1]) : e.G(t[0], t[1]);
}
function zt(e, t, n) {
  return t[0] === be ? en(e, t[1], n) : e.g(t[0], t[1], n);
}
function m(e, t, n) {
  throw e.N ? (n !== void 0 && t instanceof A && (t = e.Aa(t), _t(e, t, n)), Ye(e, 4, t), Qr) : n === void 0 ? t : n;
}
function Ye(e, t, n, r) {
  if (t === 0)
    throw TypeError("Should not unwind for NORMAL completions");
  var o = e.o;
  e:
    for (; 0 < o.length; o.pop()) {
      var s = o[o.length - 1];
      switch (s.node.type) {
        case "TryStatement":
          s.ea = {
            type: t,
            value: n,
            label: r
          };
          return;
        case "CallExpression":
        case "NewExpression":
          if (t === 3) {
            s.value = n;
            return;
          }
          if (t !== 4)
            throw Error("Unsynatctic break/continue not rejected by Acorn");
          break;
        case "Program":
          s.done = !0;
          break e;
      }
      if (t === 1) {
        if (r ? s.labels && s.labels.indexOf(r) !== -1 : s.W || s.Zb) {
          o.pop();
          return;
        }
      } else if (t === 2 && (r ? s.labels && s.labels.indexOf(r) !== -1 : s.W))
        return;
    }
  throw _(e, n, e.D) ? (t = {
    EvalError,
    RangeError,
    ReferenceError,
    SyntaxError,
    TypeError,
    URIError
  }, r = String(e.G(n, "name")), o = e.G(n, "message").valueOf(), t = (t[r] || Error)(o), t.stack = String(e.G(n, "stack"))) : t = String(n), e.value = t, t;
}
function V(e, t) {
  switch (t.type) {
    case "ArrayExpression":
      return "[...]";
    case "BinaryExpression":
    case "LogicalExpression":
      return V(e, t.left) + " " + t.operator + " " + V(e, t.right);
    case "CallExpression":
      return V(e, t.callee) + "(...)";
    case "ConditionalExpression":
      return V(e, t.test) + " ? " + V(e, t.da) + " : " + V(e, t.alternate);
    case "Identifier":
      return t.name;
    case "Literal":
      return t.raw;
    case "MemberExpression":
      var n = V(e, t.object);
      return e = V(e, t.Wa), t.bb ? n + "[" + e + "]" : n + "." + e;
    case "NewExpression":
      return "new " + V(e, t.callee) + "(...)";
    case "ObjectExpression":
      return "{...}";
    case "ThisExpression":
      return "this";
    case "UnaryExpression":
      return t.operator + " " + V(e, t.K);
    case "UpdateExpression":
      return n = V(e, t.K), t.prefix ? t.operator + n : n + t.operator;
  }
  return "???";
}
function Lr(e, t, n) {
  var r = e.o[e.o.length - 1], o = Array.from(n), s = o.shift();
  n = Math.max(Number(o.shift() || 0), 0);
  var a = e.ya();
  if (s instanceof A && s.H === "Function") {
    var f = s;
    a.type = "CallExpression", r = r.scope;
  } else {
    try {
      var g = Oe(String(s), "taskCode" + e.ic++);
    } catch (C) {
      m(e, e.T, "Invalid code: " + C.message);
    }
    a.type = "EvalProgram_", a.body = g.body, r = r.node.arguments[0], at(a, r ? r.start : void 0, r ? r.end : void 0), r = e.N, o.length = 0;
  }
  return t = new Kn(f, o, r, a, t ? n : -1), tn(e, t, n), t.Db;
}
function tn(e, t, n) {
  t.time = Date.now() + n, e.ca.push(t), e.ca.sort(function(r, o) {
    return r.time - o.time;
  });
}
function _r(e, t) {
  for (var n = 0; n < e.ca.length; n++)
    if (e.ca[n].Db == t) {
      e.ca.splice(n, 1);
      break;
    }
}
function Ze(e, t, n) {
  if (!e.P)
    throw Error("Unexpected call to createGetter");
  e.P = !1, n = Array.isArray(n) ? n[0] : n;
  var r = e.ya();
  return r.type = "CallExpression", e = new v(r, e.o[e.o.length - 1].scope), e.ia = 2, e.B = n, e.U = t, e.Qa = !0, e.F = [], e;
}
function Qt(e, t, n, r) {
  if (!e.Ka)
    throw Error("Unexpected call to createSetter");
  e.Ka = !1, n = Array.isArray(n) ? n[0] : e.Na;
  var o = e.ya();
  return o.type = "CallExpression", e = new v(o, e.o[e.o.length - 1].scope), e.ia = 2, e.B = n, e.U = t, e.Qa = !0, e.F = [r], e;
}
function Mt(e, t) {
  return t == null ? e.Na : t instanceof A ? t : (e = e.s(se(e, t)), e.data = t, e);
}
T.Xb = function() {
  return this.N;
};
T.Yb = function() {
  return this.o;
};
T.ec = function(e) {
  this.o = e;
};
function v(e, t) {
  this.node = e, this.scope = t;
}
function rn(e, t, n) {
  this.Va = e, this.S = t, this.object = n;
}
function A(e) {
  this.V = /* @__PURE__ */ Object.create(null), this.Y = /* @__PURE__ */ Object.create(null), this.h = /* @__PURE__ */ Object.create(null), this.xa = e;
}
T = A.prototype;
T.xa = null;
T.H = "Object";
T.data = null;
T.toString = function() {
  if (!Ve)
    return "[object Interpreter.Object]";
  if (!(this instanceof A))
    return String(this);
  if (this.H === "Array") {
    var e = Fr;
    e.push(this);
    try {
      var t = [], n = this.h.length, r = !1;
      1024 < n && (n = 1e3, r = !0);
      for (var o = 0; o < n; o++) {
        var s = this.h[o];
        t[o] = s instanceof A && e.indexOf(s) !== -1 ? "..." : s;
      }
      r && t.push("...");
    } finally {
      e.pop();
    }
    return t.join(",");
  }
  if (this.H === "Error") {
    if (e = Fr, e.indexOf(this) !== -1)
      return "[object Error]";
    n = this;
    do
      if ("name" in n.h) {
        t = n.h.name;
        break;
      }
    while (n = n.xa);
    n = this;
    do
      if ("message" in n.h) {
        r = n.h.message;
        break;
      }
    while (n = n.xa);
    e.push(this);
    try {
      t = t && String(t), r = r && String(r);
    } finally {
      e.pop();
    }
    return r ? t + ": " + r : String(t);
  }
  return this.data !== null ? String(this.data) : "[object " + this.H + "]";
};
T.valueOf = function() {
  return !Ve || this.data === void 0 || this.data === null || this.data instanceof RegExp ? this : this.data instanceof Date ? this.data.valueOf() : this.data;
};
function Kn(e, t, n, r, o) {
  this.zb = e, this.Lb = t, this.scope = n, this.node = r, this.interval = o, this.Db = ++Jn, this.time = 0;
}
var Jn = 0;
h.prototype.stepArrayExpression = function(e, t, n) {
  n = n.elements;
  var r = t.A || 0;
  for (t.Oa ? (this.g(t.Oa, r, t.value), r++) : (t.Oa = Ae(this), t.Oa.h.length = n.length); r < n.length; ) {
    if (n[r])
      return t.A = r, new v(n[r], t.scope);
    r++;
  }
  e.pop(), e[e.length - 1].value = t.Oa;
};
h.prototype.stepAssignmentExpression = function(e, t, n) {
  if (!t.ja)
    return t.ja = !0, t = new v(n.left, t.scope), t.sa = !0, t;
  if (!t.Da)
    return t.Fa || (t.Fa = t.value), t.Ba && (t.ma = t.value), !t.Ba && n.operator !== "=" && (e = Zt(this, t.Fa), t.ma = e, this.P) ? (t.Ba = !0, Ze(this, e, t.Fa)) : (t.Da = !0, n.operator === "=" && n.left.type === "Identifier" && (t.Pa = n.left.name), new v(n.right, t.scope));
  if (t.ta)
    e.pop(), e[e.length - 1].value = t.ib;
  else {
    var r = t.ma, o = t.value;
    switch (n.operator) {
      case "=":
        r = o;
        break;
      case "+=":
        r += o;
        break;
      case "-=":
        r -= o;
        break;
      case "*=":
        r *= o;
        break;
      case "/=":
        r /= o;
        break;
      case "%=":
        r %= o;
        break;
      case "<<=":
        r <<= o;
        break;
      case ">>=":
        r >>= o;
        break;
      case ">>>=":
        r >>>= o;
        break;
      case "&=":
        r &= o;
        break;
      case "^=":
        r ^= o;
        break;
      case "|=":
        r |= o;
        break;
      default:
        throw SyntaxError("Unknown assignment expression: " + n.operator);
    }
    if (n = zt(this, t.Fa, r))
      return t.ta = !0, t.ib = r, Qt(this, n, t.Fa, r);
    e.pop(), e[e.length - 1].value = r;
  }
};
h.prototype.stepBinaryExpression = function(e, t, n) {
  if (!t.ja)
    return t.ja = !0, new v(n.left, t.scope);
  if (!t.Da)
    return t.Da = !0, t.ma = t.value, new v(n.right, t.scope);
  e.pop();
  var r = t.ma;
  switch (t = t.value, n.operator) {
    case "==":
      n = r == t;
      break;
    case "!=":
      n = r != t;
      break;
    case "===":
      n = r === t;
      break;
    case "!==":
      n = r !== t;
      break;
    case ">":
      n = r > t;
      break;
    case ">=":
      n = r >= t;
      break;
    case "<":
      n = r < t;
      break;
    case "<=":
      n = r <= t;
      break;
    case "+":
      n = r + t;
      break;
    case "-":
      n = r - t;
      break;
    case "*":
      n = r * t;
      break;
    case "/":
      n = r / t;
      break;
    case "%":
      n = r % t;
      break;
    case "&":
      n = r & t;
      break;
    case "|":
      n = r | t;
      break;
    case "^":
      n = r ^ t;
      break;
    case "<<":
      n = r << t;
      break;
    case ">>":
      n = r >> t;
      break;
    case ">>>":
      n = r >>> t;
      break;
    case "in":
      t instanceof A || m(this, this.j, "'in' expects an object, not '" + t + "'"), n = lt(this, t, r);
      break;
    case "instanceof":
      _(this, t, this.O) || m(this, this.j, "'instanceof' expects an object, not '" + t + "'"), n = r instanceof A ? _(this, r, t) : !1;
      break;
    default:
      throw SyntaxError("Unknown binary operator: " + n.operator);
  }
  e[e.length - 1].value = n;
};
h.prototype.stepBlockStatement = function(e, t, n) {
  var r = t.A || 0;
  if (n = n.body[r])
    return t.A = r + 1, new v(n, t.scope);
  e.pop();
};
h.prototype.stepBreakStatement = function(e, t, n) {
  Ye(this, 1, void 0, n.label && n.label.name);
};
h.prototype.Hb = 0;
h.prototype.stepCallExpression = function(e, t, n) {
  if (!t.ia) {
    t.ia = 1;
    var r = new v(n.callee, t.scope);
    return r.sa = !0, r;
  }
  if (t.ia === 1) {
    t.ia = 2;
    var o = t.value;
    if (Array.isArray(o)) {
      if (t.U = Zt(this, o), o[0] === be ? t.Pb = o[1] === "eval" : t.B = o[0], o = t.U, this.P)
        return t.ia = 1, Ze(this, o, t.value);
    } else
      t.U = o;
    t.F = [], t.A = 0;
  }
  if (o = t.U, !t.Qa) {
    if (t.A !== 0 && t.F.push(t.value), n.arguments[t.A])
      return new v(n.arguments[t.A++], t.scope);
    if (n.type === "NewExpression") {
      if (o instanceof A && !o.Ab || m(this, this.j, V(this, n.callee) + " is not a constructor"), o === this.qa)
        t.B = Ae(this);
      else {
        var s = o.h.prototype;
        (typeof s != "object" || s === null) && (s = this.M), t.B = this.s(s);
      }
      t.isConstructor = !0;
    }
    t.Qa = !0;
  }
  if (t.eb)
    e.pop(), e[e.length - 1].value = t.isConstructor && typeof t.value != "object" ? t.B : t.value;
  else {
    if (t.eb = !0, o instanceof A || m(this, this.j, V(this, n.callee) + " is not a function"), e = o.node) {
      for (n = Wt(this, e.body, o.Va), r = Ae(this), o = 0; o < t.F.length; o++)
        this.g(r, o, t.F[o]);
      for (this.g(n.object, "arguments", r), o = 0; o < e.oa.length; o++)
        this.g(n.object, e.oa[o].name, t.F.length > o ? t.F[o] : void 0);
      return n.S || (t.B = Mt(this, t.B)), this.g(n.object, "this", t.B, $t), t.value = void 0, new v(e.body, n);
    }
    if (o.eval)
      if (o = t.F[0], typeof o != "string")
        t.value = o;
      else {
        try {
          r = Oe(String(o), "eval" + this.Hb++);
        } catch (f) {
          m(this, this.T, "Invalid code: " + f.message);
        }
        return o = this.ya(), o.type = "EvalProgram_", o.body = r.body, at(o, n.start, n.end), n = t.Pb ? t.scope : this.N, n.S ? n = Wt(this, r, n) : Je(this, r, n), this.value = void 0, new v(o, n);
      }
    else if (o.Ta)
      t.scope.S || (t.B = Mt(this, t.B)), t.value = o.Ta.apply(t.B, t.F);
    else if (o.Za) {
      var a = this;
      r = o.Za.length - 1, r = t.F.concat(Array(r)).slice(0, r), r.push(function(f) {
        t.value = f, a.za = !1;
      }), this.za = !0, t.scope.S || (t.B = Mt(this, t.B)), o.Za.apply(t.B, r);
    } else
      m(this, this.j, V(this, n.callee) + " is not callable");
  }
};
h.prototype.stepConditionalExpression = function(e, t, n) {
  var r = t.na || 0;
  if (r === 0)
    return t.na = 1, new v(n.test, t.scope);
  if (r === 1) {
    if (t.na = 2, (r = !!t.value) && n.da)
      return new v(n.da, t.scope);
    if (!r && n.alternate)
      return new v(n.alternate, t.scope);
    this.value = void 0;
  }
  e.pop(), n.type === "ConditionalExpression" && (e[e.length - 1].value = t.value);
};
h.prototype.stepContinueStatement = function(e, t, n) {
  Ye(this, 2, void 0, n.label && n.label.name);
};
h.prototype.stepDebuggerStatement = function(e) {
  e.pop();
};
h.prototype.stepDoWhileStatement = function(e, t, n) {
  if (n.type === "DoWhileStatement" && t.ga === void 0 && (t.value = !0, t.ga = !0), !t.ga)
    return t.ga = !0, new v(n.test, t.scope);
  if (!t.value)
    e.pop();
  else if (n.body)
    return t.ga = !1, t.W = !0, new v(n.body, t.scope);
};
h.prototype.stepEmptyStatement = function(e) {
  e.pop();
};
h.prototype.stepEvalProgram_ = function(e, t, n) {
  var r = t.A || 0;
  if (n = n.body[r])
    return t.A = r + 1, new v(n, t.scope);
  e.pop(), e[e.length - 1].value = this.value;
};
h.prototype.stepExpressionStatement = function(e, t, n) {
  if (!t.ka)
    return this.value = void 0, t.ka = !0, new v(n.la, t.scope);
  e.pop(), this.value = t.value;
};
h.prototype.stepForInStatement = function(e, t, n) {
  if (!t.Ub && (t.Ub = !0, n.left.fa && n.left.fa[0].ua))
    return t.scope.S && m(this, this.T, "for-in loop variable declaration may not have an initializer"), new v(n.left, t.scope);
  if (!t.Ca)
    return t.Ca = !0, t.pa || (t.pa = t.value), new v(n.right, t.scope);
  if (t.W || (t.W = !0, t.u = t.value, t.kb = /* @__PURE__ */ Object.create(null)), t.Ra === void 0)
    e:
      for (; ; ) {
        if (t.u instanceof A)
          for (t.wa || (t.wa = Object.getOwnPropertyNames(t.u.h)); ; ) {
            var r = t.wa.shift();
            if (r === void 0)
              break;
            if (Object.prototype.hasOwnProperty.call(t.u.h, r) && !t.kb[r] && (t.kb[r] = !0, Object.prototype.propertyIsEnumerable.call(t.u.h, r))) {
              t.Ra = r;
              break e;
            }
          }
        else if (t.u !== null && t.u !== void 0) {
          for (t.wa || (t.wa = Object.getOwnPropertyNames(t.u)); r = t.wa.shift(), r !== void 0; )
            if (t.kb[r] = !0, Object.prototype.propertyIsEnumerable.call(t.u, r)) {
              t.Ra = r;
              break e;
            }
        }
        if (t.u = se(this, t.u), t.wa = null, t.u === null) {
          e.pop();
          return;
        }
      }
  if (!t.wb)
    if (t.wb = !0, e = n.left, e.type === "VariableDeclaration")
      t.pa = [be, e.fa[0].id.name];
    else
      return t.pa = null, t = new v(e, t.scope), t.sa = !0, t;
  if (t.pa || (t.pa = t.value), !t.ta && (t.ta = !0, e = t.Ra, r = zt(this, t.pa, e)))
    return Qt(this, r, t.pa, e);
  if (t.Ra = void 0, t.wb = !1, t.ta = !1, n.body)
    return new v(n.body, t.scope);
};
h.prototype.stepForStatement = function(e, t, n) {
  switch (t.na) {
    default:
      if (t.na = 1, n.ua)
        return new v(n.ua, t.scope);
      break;
    case 1:
      if (t.na = 2, n.test)
        return new v(n.test, t.scope);
      break;
    case 2:
      if (t.na = 3, n.test && !t.value)
        e.pop();
      else
        return t.W = !0, new v(n.body, t.scope);
      break;
    case 3:
      if (t.na = 1, n.update)
        return new v(n.update, t.scope);
  }
};
h.prototype.stepFunctionDeclaration = function(e) {
  e.pop();
};
h.prototype.stepFunctionExpression = function(e, t, n) {
  e.pop(), t = e[e.length - 1], e = t.scope, n.id && (e = Jt(this, e)), t.value = Xt(this, n, e, t.Pa), n.id && this.g(e.object, n.id.name, t.value, $t);
};
h.prototype.stepIdentifier = function(e, t, n) {
  if (e.pop(), t.sa)
    e[e.length - 1].value = [be, n.name];
  else {
    if (t = Yt(this, n.name), this.P)
      return Ze(this, t, this.Na);
    e[e.length - 1].value = t;
  }
};
h.prototype.stepIfStatement = h.prototype.stepConditionalExpression;
h.prototype.stepLabeledStatement = function(e, t, n) {
  return e.pop(), e = t.labels || [], e.push(n.label.name), t = new v(n.body, t.scope), t.labels = e, t;
};
h.prototype.stepLiteral = function(e, t, n) {
  e.pop(), t = n.value, t instanceof RegExp && (n = this.s(this.Ma), Vt(this, n, t), t = n), e[e.length - 1].value = t;
};
h.prototype.stepLogicalExpression = function(e, t, n) {
  if (n.operator !== "&&" && n.operator !== "||")
    throw SyntaxError("Unknown logical operator: " + n.operator);
  if (!t.ja)
    return t.ja = !0, new v(n.left, t.scope);
  if (t.Da)
    e.pop(), e[e.length - 1].value = t.value;
  else if (n.operator === "&&" && !t.value || n.operator === "||" && t.value)
    e.pop(), e[e.length - 1].value = t.value;
  else
    return t.Da = !0, new v(n.right, t.scope);
};
h.prototype.stepMemberExpression = function(e, t, n) {
  if (!t.Ca)
    return t.Ca = !0, new v(n.object, t.scope);
  if (n.bb)
    if (t.Vb)
      n = t.value;
    else
      return t.u = t.value, t.Vb = !0, new v(n.Wa, t.scope);
  else
    t.u = t.value, n = n.Wa.name;
  if (e.pop(), t.sa)
    e[e.length - 1].value = [t.u, n];
  else {
    if (n = this.G(t.u, n), this.P)
      return Ze(this, n, t.u);
    e[e.length - 1].value = n;
  }
};
h.prototype.stepNewExpression = h.prototype.stepCallExpression;
h.prototype.stepObjectExpression = function(e, t, n) {
  var r = t.A || 0, o = n.h[r];
  if (t.u) {
    var s = t.Pa;
    t.Ja[s] || (t.Ja[s] = {}), t.Ja[s][o.kind] = t.value, t.A = ++r, o = n.h[r];
  } else
    t.u = this.s(this.M), t.Ja = /* @__PURE__ */ Object.create(null);
  if (o) {
    var a = o.key;
    if (a.type === "Identifier")
      s = a.name;
    else if (a.type === "Literal")
      s = a.value;
    else
      throw SyntaxError("Unknown object structure: " + a.type);
    return t.Pa = s, new v(o.value, t.scope);
  }
  for (a in t.Ja)
    n = t.Ja[a], "get" in n || "set" in n ? this.g(t.u, a, Ke, {
      configurable: !0,
      enumerable: !0,
      get: n.get,
      set: n.set
    }) : this.g(t.u, a, n.init);
  e.pop(), e[e.length - 1].value = t.u;
};
h.prototype.stepProgram = function(e, t, n) {
  if (e = n.body.shift())
    return t.done = !1, new v(e, t.scope);
  t.done = !0;
};
h.prototype.stepReturnStatement = function(e, t, n) {
  if (n.K && !t.ka)
    return t.ka = !0, new v(n.K, t.scope);
  Ye(this, 3, t.value);
};
h.prototype.stepSequenceExpression = function(e, t, n) {
  var r = t.A || 0;
  if (n = n.xb[r])
    return t.A = r + 1, new v(n, t.scope);
  e.pop(), e[e.length - 1].value = t.value;
};
h.prototype.stepSwitchStatement = function(e, t, n) {
  if (!t.ga)
    return t.ga = 1, new v(n.Qb, t.scope);
  for (t.ga === 1 && (t.ga = 2, t.hc = t.value, t.cb = -1); ; ) {
    var r = t.gb || 0, o = n.tb[r];
    if (t.Ha || !o || o.test)
      if (o || t.Ha || t.cb === -1)
        if (o) {
          if (!t.Ha && !t.Fb && o.test)
            return t.Fb = !0, new v(o.test, t.scope);
          if (t.Ha || t.value === t.hc) {
            t.Ha = !0;
            var s = t.A || 0;
            if (o.da[s])
              return t.Zb = !0, t.A = s + 1, new v(o.da[s], t.scope);
          }
          t.Fb = !1, t.A = 0, t.gb = r + 1;
        } else {
          e.pop();
          break;
        }
      else
        t.Ha = !0, t.gb = t.cb;
    else
      t.cb = r, t.gb = r + 1;
  }
};
h.prototype.stepThisExpression = function(e) {
  e.pop(), e[e.length - 1].value = Yt(this, "this");
};
h.prototype.stepThrowStatement = function(e, t, n) {
  if (t.ka)
    m(this, t.value);
  else
    return t.ka = !0, new v(n.K, t.scope);
};
h.prototype.stepTryStatement = function(e, t, n) {
  if (!t.Rb)
    return t.Rb = !0, new v(n.block, t.scope);
  if (t.ea && t.ea.type === 4 && !t.Tb && n.Ea)
    return t.Tb = !0, e = Jt(this, t.scope), this.g(e.object, n.Ea.Ua.name, t.ea.value), t.ea = void 0, new v(n.Ea.body, e);
  if (!t.Sb && n.fb)
    return t.Sb = !0, new v(n.fb, t.scope);
  e.pop(), t.ea && Ye(this, t.ea.type, t.ea.value, t.ea.label);
};
h.prototype.stepUnaryExpression = function(e, t, n) {
  if (!t.ka)
    return t.ka = !0, e = new v(n.K, t.scope), e.sa = n.operator === "delete", e;
  e.pop();
  var r = t.value;
  switch (n.operator) {
    case "-":
      r = -r;
      break;
    case "+":
      r = +r;
      break;
    case "!":
      r = !r;
      break;
    case "~":
      r = ~r;
      break;
    case "delete":
      if (n = !0, Array.isArray(r)) {
        var o = r[0];
        o === be && (o = t.scope), r = String(r[1]);
        try {
          delete o.h[r];
        } catch {
          t.scope.S ? m(this, this.j, "Cannot delete property '" + r + "' of '" + o + "'") : n = !1;
        }
      }
      r = n;
      break;
    case "typeof":
      r = r && r.H === "Function" ? "function" : typeof r;
      break;
    case "void":
      r = void 0;
      break;
    default:
      throw SyntaxError("Unknown unary operator: " + n.operator);
  }
  e[e.length - 1].value = r;
};
h.prototype.stepUpdateExpression = function(e, t, n) {
  if (!t.ja)
    return t.ja = !0, e = new v(n.K, t.scope), e.sa = !0, e;
  if (t.Ga || (t.Ga = t.value), t.Ba && (t.ma = t.value), !t.Ba) {
    var r = Zt(this, t.Ga);
    if (t.ma = r, this.P)
      return t.Ba = !0, Ze(this, r, t.Ga);
  }
  if (t.ta)
    e.pop(), e[e.length - 1].value = t.ib;
  else {
    if (r = Number(t.ma), n.operator === "++")
      var o = r + 1;
    else if (n.operator === "--")
      o = r - 1;
    else
      throw SyntaxError("Unknown update expression: " + n.operator);
    if (n = n.prefix ? o : r, r = zt(this, t.Ga, o))
      return t.ta = !0, t.ib = n, Qt(this, r, t.Ga, o);
    e.pop(), e[e.length - 1].value = n;
  }
};
h.prototype.stepVariableDeclaration = function(e, t, n) {
  n = n.fa;
  var r = t.A || 0, o = n[r];
  for (t.Bb && o && (en(this, o.id.name, t.value), t.Bb = !1, o = n[++r]); o; ) {
    if (o.ua)
      return t.A = r, t.Bb = !0, t.Pa = o.id.name, new v(o.ua, t.scope);
    o = n[++r];
  }
  e.pop();
};
h.prototype.stepWithStatement = function(e, t, n) {
  return t.Ca ? (e.pop(), e = Jt(this, t.scope, t.value), new v(n.body, e)) : (t.Ca = !0, new v(n.object, t.scope));
};
h.prototype.stepWhileStatement = h.prototype.stepDoWhileStatement;
fe.Interpreter = h;
h.prototype.step = h.prototype.lb;
h.prototype.run = h.prototype.Eb;
h.prototype.appendCode = h.prototype.Jb;
h.prototype.createObject = h.prototype.Aa;
h.prototype.createObjectProto = h.prototype.s;
h.prototype.createAsyncFunction = h.prototype.ub;
h.prototype.createNativeFunction = h.prototype.i;
h.prototype.getProperty = h.prototype.G;
h.prototype.setProperty = h.prototype.g;
h.prototype.nativeToPseudo = h.prototype.Ia;
h.prototype.pseudoToNative = h.prototype.R;
h.prototype.getGlobalScope = h.prototype.Xb;
h.prototype.getStateStack = h.prototype.Yb;
h.prototype.setStateStack = h.prototype.ec;
h.VALUE_IN_DESCRIPTOR = Ke;
const Yn = (e) => e.split(`
`).map((t) => {
  const n = t.trim();
  if (t.includes("__awaiter"))
    return;
  if (!n.startsWith("state."))
    return t;
  const [o, s] = n.split("="), f = `setRootState('${o.replace("state.", "").trim()}', ${s.trim()})`;
  return `
  ${t}
  ${f}
  `;
}).filter(Boolean).join(`
`), Wr = (e) => e + "JSON", Zn = ({
  builder: e,
  context: t,
  event: n,
  rootState: r,
  localState: o,
  rootSetState: s,
  code: a
}) => {
  const f = {
    ...r,
    ...o
  }, g = Yr({
    builder: e,
    context: t,
    event: n,
    state: f
  }), C = g.map(([I]) => {
    const W = Wr(I);
    return `var ${I} = ${W} === undefined ? undefined : JSON.parse(${W});`;
  }).join(`
`), j = Yn(a);
  if (j === "") {
    Xe.warn("Skipping evaluation of empty code block.");
    return;
  }
  const S = `
function theFunction() {
  ${C}

  ${j}
}
theFunction();
`, N = (I, W) => {
    const z = zr(f, I, W);
    s == null || s(z);
  }, P = function(I, W) {
    g.forEach(([z, pe]) => {
      const O = JSON.stringify(pe);
      I.setProperty(W, Wr(z), O);
    }), I.setProperty(W, "setRootState", I.createNativeFunction(N));
  };
  try {
    const I = new h(S, P);
    return I.run(), I.pseudoToNative(I.value);
  } catch (I) {
    Xe.warn("Custom code error in edge runtime. NOTE: your code must be ES5 JavaScript.", {
      e: I
    });
    return;
  }
};
function zn() {
  var e;
  return typeof process != "undefined" && it((e = process == null ? void 0 : process.versions) == null ? void 0 : e.node);
}
const Qn = () => {
  var r;
  if (!zn())
    return !1;
  const e = process.arch === "arm64", t = process.version.startsWith("v20"), n = (r = process.env.NODE_OPTIONS) == null ? void 0 : r.includes("--no-node-snapshot");
  return e && t && !n ? (Xe.log("Skipping usage of `isolated-vm` to avoid crashes in Node v20 on an arm64 machine.\n    If you would like to use the `isolated-vm` package on this machine, please provide the `NODE_OPTIONS=--no-node-snapshot` config to your Node process.\n    See https://github.com/BuilderIO/builder/blob/main/packages/sdks/README.md#node-v20--m1-macs-apple-silicon-support for more information.\n    "), !0) : !1;
}, qn = (e) => Ft() || Qn() ? Pn(e) : Zn(e), ne = class ne {
  static getCacheKey(t) {
    return JSON.stringify({
      ...t,
      // replace the event with a random number to break cache
      // thats because we can't serialize the event object due to circular refs in DOM node refs.
      event: t.event ? Math.random() : void 0
    });
  }
  static getCachedValue(t) {
    return ne.cache.get(t);
  }
  static setCachedValue(t, n) {
    ne.cache.size > 20 && ne.cache.delete(ne.cache.keys().next().value), ne.cache.set(t, {
      value: n
    });
  }
};
Rt(ne, "cacheLimit", 20), Rt(ne, "cache", /* @__PURE__ */ new Map());
let je = ne;
function qt({
  code: e,
  context: t,
  localState: n,
  rootState: r,
  rootSetState: o,
  event: s,
  isExpression: a = !0,
  enableCache: f
}) {
  if (e === "") {
    Xe.warn("Skipping evaluation of empty code block.");
    return;
  }
  const g = {
    code: Nn(e, {
      isExpression: a
    }),
    builder: Tn(),
    context: t,
    event: s,
    rootSetState: o,
    rootState: r,
    localState: n
  };
  if (f) {
    const C = je.getCacheKey(g), j = je.getCachedValue(C);
    if (j)
      return j.value;
  }
  try {
    const C = qn(g);
    if (f) {
      const j = je.getCacheKey(g);
      je.setCachedValue(j, C);
    }
    return C;
  } catch (C) {
    Xe.error("Failed code evaluation: " + C.message, {
      code: e
    });
    return;
  }
}
const eo = ({
  block: e,
  context: t,
  localState: n,
  rootState: r,
  rootSetState: o
}) => {
  if (!e.bindings)
    return e;
  const s = Xr(e), a = {
    ...s,
    properties: {
      ...s.properties
    },
    actions: {
      ...s.actions
    }
  };
  for (const f in e.bindings) {
    const g = e.bindings[f], C = qt({
      code: g,
      localState: n,
      rootState: r,
      rootSetState: o,
      context: t,
      enableCache: !0
    });
    zr(a, f, C);
  }
  return a;
};
function st({
  block: e,
  context: t,
  shouldEvaluateBindings: n,
  localState: r,
  rootState: o,
  rootSetState: s
}) {
  const a = e;
  return n ? eo({
    block: a,
    localState: r,
    rootState: o,
    rootSetState: s,
    context: t
  }) : a;
}
function to(e, t, n = {}) {
  let r, o, s, a = null, f = 0;
  const g = function() {
    f = n.leading === !1 ? 0 : Date.now(), a = null, s = e.apply(r, o), a || (r = o = null);
  };
  return function() {
    const C = Date.now();
    !f && n.leading === !1 && (f = C);
    const j = t - (C - f);
    return r = this, o = arguments, j <= 0 || j > t ? (a && (clearTimeout(a), a = null), f = C, s = e.apply(r, o), a || (r = o = null)) : !a && n.trailing !== !1 && (a = setTimeout(g, j)), s;
  };
}
function ye(e, ...t) {
  const n = Object(e);
  for (let r = 1; r < arguments.length; r++) {
    const o = arguments[r];
    if (o != null)
      for (const s in o)
        Object.prototype.hasOwnProperty.call(o, s) && (n[s] = o[s]);
  }
  return n;
}
const er = (e) => e ? e.replace(/([A-Z])/g, (t) => `-${t[0].toLowerCase()}`) : "";
function ro(e) {
  for (const t of e)
    switch (t.trigger) {
      case "pageLoad":
        oo(t);
        break;
      case "hover":
        io(t);
        break;
      case "scrollInView":
        so(t);
        break;
    }
}
function tr(e) {
  console.warn(`Cannot animate element: element with ID ${e} not found!`);
}
function rr(e, t) {
  const n = no(e), r = getComputedStyle(t), o = e.steps[0].styles, s = e.steps[e.steps.length - 1].styles, a = [o, s];
  for (const f of a)
    for (const g of n)
      g in f || (f[g] = r[g]);
}
function no(e) {
  const t = [];
  for (const n of e.steps)
    for (const r in n.styles)
      t.indexOf(r) === -1 && t.push(r);
  return t;
}
function oo(e) {
  const t = Array.prototype.slice.call(document.getElementsByClassName(e.elementId || e.id || ""));
  if (!t.length) {
    tr(e.elementId || e.id || "");
    return;
  }
  Array.from(t).forEach((n) => {
    rr(e, n), n.style.transition = "none", n.style.transitionDelay = "0", ye(n.style, e.steps[0].styles), setTimeout(() => {
      n.style.transition = `all ${e.duration}s ${er(e.easing)}`, e.delay && (n.style.transitionDelay = e.delay + "s"), ye(n.style, e.steps[1].styles), setTimeout(() => {
        n.style.transition = "", n.style.transitionDelay = "";
      }, (e.delay || 0) * 1e3 + e.duration * 1e3 + 100);
    });
  });
}
function io(e) {
  const t = Array.prototype.slice.call(document.getElementsByClassName(e.elementId || e.id || ""));
  if (!t.length) {
    tr(e.elementId || e.id || "");
    return;
  }
  Array.from(t).forEach((n) => {
    rr(e, n);
    const r = e.steps[0].styles, o = e.steps[1].styles;
    function s() {
      ye(n.style, r);
    }
    function a() {
      ye(n.style, o);
    }
    s(), n.addEventListener("mouseenter", a), n.addEventListener("mouseleave", s), setTimeout(() => {
      n.style.transition = `all ${e.duration}s ${er(e.easing)}`, e.delay && (n.style.transitionDelay = e.delay + "s");
    });
  });
}
function so(e) {
  const t = Array.prototype.slice.call(document.getElementsByClassName(e.elementId || e.id || ""));
  if (!t.length) {
    tr(e.elementId || e.id || "");
    return;
  }
  Array.from(t).forEach((n) => {
    rr(e, n);
    let r = !1, o = !1;
    function s() {
      !r && f(n) ? (r = !0, o = !0, setTimeout(() => {
        ye(n.style, e.steps[1].styles), e.repeat || document.removeEventListener("scroll", a), setTimeout(() => {
          o = !1, e.repeat || (n.style.transition = "", n.style.transitionDelay = "");
        }, (e.duration + (e.delay || 0)) * 1e3 + 100);
      })) : e.repeat && r && !o && !f(n) && (r = !1, ye(n.style, e.steps[0].styles));
    }
    const a = to(s, 200, {
      leading: !1
    });
    function f(j) {
      const S = j.getBoundingClientRect(), N = window.innerHeight, I = (e.thresholdPercent || 0) / 100 * N;
      return S.bottom > I && S.top < N - I;
    }
    const g = e.steps[0].styles;
    function C() {
      ye(n.style, g);
    }
    C(), setTimeout(() => {
      n.style.transition = `all ${e.duration}s ${er(e.easing)}`, e.delay && (n.style.transitionDelay = e.delay + "s");
    }), document.addEventListener("scroll", a, {
      capture: !0,
      passive: !0
    }), s();
  });
}
const ao = (e) => e.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase(), nn = (e) => Object.entries(e).map(([n, r]) => {
  if (typeof r == "string")
    return `${ao(n)}: ${r};`;
}).filter(it), lo = (e) => nn(e).join(`
`), Bt = ({
  mediaQuery: e,
  className: t,
  styles: n
}) => {
  const r = `.${t} {
    ${lo(n)}
  }`;
  return e ? `${e} {
      ${r}
    }` : r;
};
function uo({
  style: e
}) {
  return e;
}
const co = ({
  block: e,
  context: t
}) => fo(uo({
  style: e.style || {},
  context: t,
  block: e
}));
function fo(e) {
  switch (Kr) {
    case "svelte":
    case "vue":
    case "solid":
      return nn(e).join(" ");
    case "qwik":
    case "reactNative":
    case "react":
    case "rsc":
      return e;
  }
}
const po = ({
  block: e,
  context: t,
  registeredComponents: n
}) => {
  var s;
  const r = (s = st({
    block: e,
    localState: t.localState,
    rootState: t.rootState,
    rootSetState: t.rootSetState,
    context: t.context,
    shouldEvaluateBindings: !1
  }).component) == null ? void 0 : s.name;
  if (!r)
    return null;
  const o = n[r];
  if (o)
    return o;
  console.warn(`
      Could not find a registered component named "${r}". 
      If you registered it, is the file that registered it imported by the file that needs to render it?`);
}, ho = ({
  block: e,
  context: t
}) => {
  const {
    repeat: n,
    ...r
  } = e;
  if (!(n != null && n.collection))
    return;
  const o = qt({
    code: n.collection,
    localState: t.localState,
    rootState: t.rootState,
    rootSetState: t.rootSetState,
    context: t.context,
    enableCache: !0
  });
  if (!Array.isArray(o))
    return;
  const s = n.collection.split(".").pop(), a = n.itemName || (s ? s + "Item" : "item");
  return o.map((g, C) => ({
    context: {
      ...t,
      localState: {
        ...t.localState,
        $index: C,
        $item: g,
        [a]: g,
        [`$${a}Index`]: C
      }
    },
    block: r
  }));
}, on = {
  small: {
    min: 320,
    default: 321,
    max: 640
  },
  medium: {
    min: 641,
    default: 642,
    max: 991
  },
  large: {
    min: 990,
    default: 991,
    max: 1200
  }
}, $r = (e, t = on) => `@media (max-width: ${t[e].max}px)`, go = ({
  small: e,
  medium: t
}) => {
  const n = Xr(on);
  if (!e || !t)
    return n;
  const r = Math.floor(e / 2);
  n.small = {
    max: e,
    min: r,
    default: r + 1
  };
  const o = n.small.max + 1;
  n.medium = {
    max: t,
    min: o,
    default: o + 1
  };
  const s = n.medium.max + 1;
  return n.large = {
    max: 2e3,
    // TODO: decide upper limit
    min: s,
    default: s + 1
  }, n;
};
function yo(e) {
  return /* @__PURE__ */ b(
    "style",
    {
      dangerouslySetInnerHTML: { __html: e.styles },
      "data-id": e.id
    }
  );
}
function vo(e) {
  function t() {
    const r = st({
      block: e.block,
      localState: e.context.localState,
      rootState: e.context.rootState,
      rootSetState: e.context.rootSetState,
      context: e.context.context,
      shouldEvaluateBindings: !0
    });
    return it(r.hide) ? !r.hide : it(r.show) ? r.show : !0;
  }
  function n() {
    var I;
    const r = st({
      block: e.block,
      localState: e.context.localState,
      rootState: e.context.rootState,
      rootSetState: e.context.rootSetState,
      context: e.context.context,
      shouldEvaluateBindings: !0
    }), o = r.responsiveStyles, s = e.context.content, a = go(
      ((I = s == null ? void 0 : s.meta) == null ? void 0 : I.breakpoints) || {}
    ), f = o == null ? void 0 : o.large, g = o == null ? void 0 : o.medium, C = o == null ? void 0 : o.small, j = r.id;
    if (!j)
      return "";
    const S = f ? Bt({
      className: j,
      styles: f
    }) : "", N = g ? Bt({
      className: j,
      styles: g,
      mediaQuery: $r(
        "medium",
        a
      )
    }) : "", P = C ? Bt({
      className: j,
      styles: C,
      mediaQuery: $r(
        "small",
        a
      )
    }) : "";
    return [S, N, P].join(" ");
  }
  return /* @__PURE__ */ b(H, { children: n() && t() ? /* @__PURE__ */ b(H, { children: /* @__PURE__ */ b(yo, { id: "builderio-block", styles: n() }) }) : null });
}
function mo(e) {
  return e.charAt(0).toUpperCase() + e.slice(1);
}
const So = (e) => `on${mo(e)}`, wo = (e, t) => (n) => qt({
  code: e,
  context: t.context,
  localState: t.localState,
  rootState: t.rootState,
  rootSetState: t.rootSetState,
  event: n,
  isExpression: !1,
  enableCache: !0
});
function sn(e) {
  var r;
  const t = {}, n = (r = e.block.actions) != null ? r : {};
  for (const o in n) {
    if (!n.hasOwnProperty(o))
      continue;
    const s = n[o];
    let a = So(o);
    if (e.stripPrefix)
      switch (Kr) {
        case "vue":
          a = a.replace("v-on:", "");
          break;
        case "svelte":
          a = a.replace("on:", "");
          break;
      }
    t[a] = wo(s, e);
  }
  return t;
}
function xo({
  properties: e
}) {
  return e;
}
const ko = (e) => ({
  href: e.href
});
function nr({
  block: e,
  context: t
}) {
  var r;
  const n = {
    ...ko(e),
    ...e.properties,
    "builder-id": e.id,
    style: co({
      block: e,
      context: t
    }),
    [An()]: [e.id, "builder-block", e.class, (r = e.properties) == null ? void 0 : r.class].filter(Boolean).join(" ")
  };
  return xo({
    properties: n,
    context: t,
    block: e
  });
}
const Eo = /* @__PURE__ */ new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"]), Co = (e) => typeof e == "string" && Eo.has(e.toLowerCase());
function jo(e) {
  return /* @__PURE__ */ b(H, { children: Co(e.TagName) ? /* @__PURE__ */ b(H, { children: /* @__PURE__ */ b(e.TagName, { ...e.attributes, ...e.actionAttributes }) }) : /* @__PURE__ */ b(H, { children: typeof e.TagName == "string" ? /* @__PURE__ */ b(e.TagName, { ...e.attributes, ...e.actionAttributes, children: e.children }) : /* @__PURE__ */ b(e.TagName, { ...e.attributes, ...e.actionAttributes, children: e.children }) }) });
}
function Oo(e) {
  return /* @__PURE__ */ b(
    jo,
    {
      TagName: e.Wrapper,
      attributes: nr({
        block: e.block,
        context: e.context
      }),
      actionAttributes: sn({
        block: e.block,
        rootState: e.context.rootState,
        rootSetState: e.context.rootSetState,
        localState: e.context.localState,
        context: e.context.context,
        stripPrefix: !0
      }),
      children: e.children
    }
  );
}
function Ao(e) {
  return /* @__PURE__ */ b(
    e.Wrapper,
    {
      ...e.wrapperProps,
      attributes: e.includeBlockProps ? {
        ...nr({
          block: e.block,
          context: e.context
        }),
        ...sn({
          block: e.block,
          rootState: e.context.rootState,
          rootSetState: e.context.rootSetState,
          localState: e.context.localState,
          context: e.context.context
        })
      } : {},
      children: e.children
    }
  );
}
const bo = ({
  componentOptions: e,
  builderBlock: t,
  context: n,
  componentRef: r,
  includeBlockProps: o,
  isInteractive: s,
  contextValue: a
}) => {
  const f = {
    ...e,
    /**
     * If `noWrap` is set to `true`, then the block's props/attributes are provided to the
     * component itself directly. Otherwise, they are provided to the wrapper element.
     */
    ...o ? {
      attributes: nr({
        block: t,
        context: a
      })
    } : {}
  };
  return s ? {
    Wrapper: r,
    block: t,
    context: n,
    wrapperProps: e,
    includeBlockProps: o
  } : f;
};
function Gr(e) {
  var r;
  const [t, n] = Hr(
    () => e.isInteractive ? Ao : e.componentRef
  );
  return /* @__PURE__ */ b(H, { children: e.componentRef ? /* @__PURE__ */ b(H, { children: /* @__PURE__ */ b(
    t,
    {
      ...bo({
        componentOptions: e.componentOptions,
        builderBlock: e.builderBlock,
        context: e.context,
        componentRef: e.componentRef,
        linkComponent: e.linkComponent,
        includeBlockProps: e.includeBlockProps,
        isInteractive: e.isInteractive,
        contextValue: e.context
      }),
      children: (r = e.blockChildren) == null ? void 0 : r.map((o) => /* @__PURE__ */ b(
        ut,
        {
          block: o,
          context: e.context,
          registeredComponents: e.registeredComponents,
          linkComponent: e.linkComponent
        },
        o.id
      ))
    }
  ) }) : null });
}
function Io(e) {
  const [t, n] = Hr(() => e.repeatContext);
  return /* @__PURE__ */ b(Jr.Provider, { value: t, children: /* @__PURE__ */ b(
    ut,
    {
      block: e.block,
      context: t,
      registeredComponents: e.registeredComponents,
      linkComponent: e.linkComponent
    }
  ) });
}
function ut(e) {
  var g, C, j;
  function t() {
    return po({
      block: e.block,
      context: e.context,
      registeredComponents: e.registeredComponents
    });
  }
  function n() {
    return ho({
      block: e.block,
      context: e.context
    });
  }
  function r() {
    var S;
    return (S = e.block.repeat) != null && S.collection ? e.block : st({
      block: e.block,
      localState: e.context.localState,
      rootState: e.context.rootState,
      rootSetState: e.context.rootSetState,
      context: e.context.context,
      shouldEvaluateBindings: !0
    });
  }
  function o() {
    var N;
    return e.block.tagName === "a" || ((N = r().properties) == null ? void 0 : N.href) || r().href ? e.linkComponent || "a" : e.block.tagName || "div";
  }
  function s() {
    var P, I;
    if ((P = e.block.repeat) != null && P.collection)
      return !!((I = n == null ? void 0 : n()) != null && I.length);
    const S = "hide" in r() ? r().hide : !1;
    return ("show" in r() ? r().show : !0) && !S;
  }
  function a() {
    var N, P;
    return !((N = t == null ? void 0 : t()) != null && N.component) && !n() ? (P = r().children) != null ? P : [] : [];
  }
  function f() {
    var S, N, P, I, W, z, pe, O, ve, Ie, Te;
    return {
      blockChildren: (S = r().children) != null ? S : [],
      componentRef: (N = t == null ? void 0 : t()) == null ? void 0 : N.component,
      componentOptions: {
        ...In(r()),
        builderContext: e.context,
        ...((P = t == null ? void 0 : t()) == null ? void 0 : P.name) === "Core:Button" || ((I = t == null ? void 0 : t()) == null ? void 0 : I.name) === "Symbol" || ((W = t == null ? void 0 : t()) == null ? void 0 : W.name) === "Columns" || ((z = t == null ? void 0 : t()) == null ? void 0 : z.name) === "Form:Form" ? {
          builderLinkComponent: e.linkComponent
        } : {},
        ...((pe = t == null ? void 0 : t()) == null ? void 0 : pe.name) === "Symbol" || ((O = t == null ? void 0 : t()) == null ? void 0 : O.name) === "Columns" || ((ve = t == null ? void 0 : t()) == null ? void 0 : ve.name) === "Form:Form" ? {
          builderComponents: e.registeredComponents
        } : {}
      },
      context: e.context,
      linkComponent: e.linkComponent,
      registeredComponents: e.registeredComponents,
      builderBlock: r(),
      includeBlockProps: ((Ie = t == null ? void 0 : t()) == null ? void 0 : Ie.noWrap) === !0,
      isInteractive: !((Te = t == null ? void 0 : t()) != null && Te.isRSC)
    };
  }
  return jn(() => {
    const S = r().id, N = r().animations;
    N && S && ro(
      N.filter((P) => P.trigger !== "hover").map((P) => ({
        ...P,
        elementId: S
      }))
    );
  }, []), /* @__PURE__ */ b(H, { children: s() ? /* @__PURE__ */ Dt(H, { children: [
    /* @__PURE__ */ b(vo, { block: e.block, context: e.context }),
    (g = t == null ? void 0 : t()) != null && g.noWrap ? /* @__PURE__ */ b(H, { children: /* @__PURE__ */ b(
      Gr,
      {
        componentRef: f().componentRef,
        componentOptions: f().componentOptions,
        blockChildren: f().blockChildren,
        context: f().context,
        registeredComponents: f().registeredComponents,
        linkComponent: f().linkComponent,
        builderBlock: f().builderBlock,
        includeBlockProps: f().includeBlockProps,
        isInteractive: f().isInteractive
      }
    ) }) : /* @__PURE__ */ b(H, { children: n() ? /* @__PURE__ */ b(H, { children: (j = n()) == null ? void 0 : j.map((S, N) => /* @__PURE__ */ b(
      Io,
      {
        repeatContext: S.context,
        block: S.block,
        registeredComponents: e.registeredComponents,
        linkComponent: e.linkComponent
      },
      N
    )) }) : /* @__PURE__ */ Dt(
      Oo,
      {
        Wrapper: o(),
        block: r(),
        context: e.context,
        linkComponent: e.linkComponent,
        children: [
          /* @__PURE__ */ b(
            Gr,
            {
              componentRef: f().componentRef,
              componentOptions: f().componentOptions,
              blockChildren: f().blockChildren,
              context: f().context,
              registeredComponents: f().registeredComponents,
              linkComponent: f().linkComponent,
              builderBlock: f().builderBlock,
              includeBlockProps: f().includeBlockProps,
              isInteractive: f().isInteractive
            }
          ),
          (C = a()) == null ? void 0 : C.map((S) => /* @__PURE__ */ b(
            ut,
            {
              block: S,
              registeredComponents: e.registeredComponents,
              linkComponent: e.linkComponent,
              context: e.context
            },
            S.id
          ))
        ]
      }
    ) })
  ] }) : null });
}
function To(e) {
  function t() {
    var o;
    return "builder-blocks" + ((o = e.blocks) != null && o.length ? "" : " no-blocks");
  }
  function n() {
    var o, s;
    Ut() && !((o = e.blocks) != null && o.length) && ((s = window.parent) == null || s.postMessage(
      {
        type: "builder.clickEmptyBlocks",
        data: {
          parentElementId: e.parent,
          dataPath: e.path
        }
      },
      "*"
    ));
  }
  function r() {
    var o, s;
    Ut() && !((o = e.blocks) != null && o.length) && ((s = window.parent) == null || s.postMessage(
      {
        type: "builder.hoverEmptyBlocks",
        data: {
          parentElementId: e.parent,
          dataPath: e.path
        }
      },
      "*"
    ));
  }
  return /* @__PURE__ */ Dt(H, { children: [
    /* @__PURE__ */ b(
      e.BlocksWrapper,
      {
        className: t() + " props-blocks-wrapper-7cd1560e",
        "builder-path": e.path,
        "builder-parent-id": e.parent,
        style: e.styleProp,
        onClick: (o) => n(),
        onMouseEnter: (o) => r(),
        onKeyPress: (o) => n(),
        ...e.BlocksWrapperProps,
        children: e.children
      }
    ),
    /* @__PURE__ */ b("style", { children: `.props-blocks-wrapper-7cd1560e {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}` })
  ] });
}
function No(e) {
  var r, o, s;
  const t = Br(Jr), n = Br(bn);
  return /* @__PURE__ */ b(
    To,
    {
      blocks: e.blocks,
      parent: e.parent,
      path: e.path,
      styleProp: e.styleProp,
      BlocksWrapper: ((r = e.context) == null ? void 0 : r.BlocksWrapper) || t.BlocksWrapper,
      BlocksWrapperProps: ((o = e.context) == null ? void 0 : o.BlocksWrapperProps) || t.BlocksWrapperProps,
      children: e.blocks ? /* @__PURE__ */ b(H, { children: (s = e.blocks) == null ? void 0 : s.map((a) => /* @__PURE__ */ b(
        ut,
        {
          block: a,
          linkComponent: e.linkComponent,
          context: e.context || t,
          registeredComponents: e.registeredComponents || n.registeredComponents
        },
        a.id
      )) }) : null
    }
  );
}
const Uo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: No
}, Symbol.toStringTag, { value: "Module" }));
export {
  No as Blocks,
  bn as ComponentsContext,
  jo as DynamicRenderer,
  yo as InlinedStyles,
  Uo as blocks,
  Jr as builderContext,
  qt as evaluate,
  go as getSizesForBreakpoints,
  fo as mapStyleObjToStrIfNeeded,
  oo as triggerAnimation
};
