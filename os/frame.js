/* The Wicflow app frame for the website demos: a browser window around the same layout customers get in the real
   apps (wicflow-growth on the ecosystem shell): a frosted sidebar with the Wicflow mark, the product switcher, the
   app's navigation and the signed-in person, and a page with a large title, cards and pill buttons. Demo-only
   controls (sample data, view as, reset, the "try this" list) sit outside the window so the window stays the product.
   Strings are {sv, fi, en}; WF.L picks the page language. */
(() => {
  const { L, toast: baseToast } = window.WF;
  const MARK_PATH = "M 847.5 286.205 C 818.427 291.923,787.571 313.105,764.768 343 C 760.469 348.636,757.615 351.5,756.299 351.5 C 755.111 351.5,748.323 345.793,739.407 337.299 C 726.389 324.898,705.632 308,703.418 308 C 702.999 308,701.947 307.371,701.079 306.601 C 697.121 303.096,674.783 292,671.682 292 C 670.897 292,668.285 291.134,665.877 290.076 C 651.945 283.953,615.459 283.954,603.864 290.079 C 601.864 291.136,599.602 292,598.836 292 C 595.537 292,578.998 301.869,569.256 309.652 C 559.132 317.739,537.985 341.678,534.718 348.75 C 533.112 352.228,531.195 351.507,524.078 344.75 C 518.355 339.316,509.738 331.576,500.246 323.344 C 498.736 322.034,495.7 319.757,493.5 318.284 C 491.3 316.811,488.375 314.624,487 313.424 C 483.779 310.615,464.753 299.206,460.085 297.285 C 458.113 296.473,455.15 295.205,453.5 294.467 C 426.785 282.511,390.023 283.362,366.5 296.48 C 323.719 320.337,307.693 366.865,328.335 407.28 C 339.953 430.024,360.787 443.962,396.5 452.879 C 414.022 457.254,431.42 467.449,444.341 480.914 C 451.967 488.861,451.249 489.019,457.536 478 C 459.576 474.425,462.165 469.925,463.291 468 C 464.416 466.075,466.322 462.7,467.526 460.5 C 471.345 453.523,473.819 449.247,476.446 445.085 C 477.851 442.86,479 440.797,479 440.5 C 479 440.203,480.149 438.14,481.554 435.915 C 482.958 433.69,484.925 430.436,485.925 428.685 C 486.925 426.933,490.109 421.45,493.001 416.5 C 495.893 411.55,499.39 405.475,500.772 403 C 502.155 400.525,504.122 397.306,505.143 395.846 C 506.164 394.386,507 392.88,507 392.5 C 507 392.12,508.013 390.399,509.25 388.675 C 511.691 385.275,513.507 382.357,514.648 380 C 515.047 379.175,517.412 375.35,519.903 371.5 C 522.395 367.65,525.041 363.375,525.783 362 C 527.624 358.589,531.092 355,532.545 355 C 533.737 355,542.718 364.178,557 379.991 C 561.125 384.558,565.191 389.016,566.036 389.898 C 566.882 390.779,570.932 395.533,575.036 400.462 C 579.141 405.391,583.175 410.137,584 411.008 C 584.825 411.879,587.354 414.821,589.621 417.546 C 595.689 424.841,605.49 436.531,614 446.624 C 618.125 451.517,623.166 457.54,625.203 460.01 C 627.239 462.479,633.648 470.125,639.445 477 C 645.241 483.875,652.338 492.538,655.216 496.25 C 661.373 504.193,663.445 504.73,666.76 499.242 C 668.004 497.184,669.458 494.825,669.992 494 C 674.308 487.331,683 472.94,683 472.462 C 683 472.134,684.125 470.392,685.5 468.589 C 686.875 466.786,688 465.01,688 464.642 C 688 464.275,692.163 457.407,697.25 449.38 C 702.337 441.354,707.581 432.922,708.902 430.643 C 710.224 428.365,713.936 422.548,717.152 417.717 C 720.369 412.887,723 408.654,723 408.312 C 723 407.969,724.125 406.214,725.5 404.411 C 726.875 402.608,728 400.826,728 400.451 C 728 400.076,729.938 396.783,732.306 393.134 C 741.348 379.203,742.487 377.428,743.972 374.957 C 747.799 368.588,753.656 359.572,755.226 357.632 L 756.952 355.5 761.226 360.05 C 769.034 368.362,780.887 381.577,784.216 385.682 C 788.287 390.701,807.263 413.317,807.977 414 C 809.756 415.702,831.285 442.07,839.289 452.35 C 841.922 455.732,845.155 459.665,846.472 461.09 C 853.117 468.275,861.852 482.782,865.117 492.057 C 868.611 501.98,868.49 520.65,864.865 531 C 854.677 560.089,825.286 580.085,788.922 582.666 C 776.305 583.562,756.277 580.192,745 575.277 C 736.456 571.553,726.916 566.603,725.882 565.358 C 725.262 564.611,724.341 564,723.835 564 C 722.649 564,714.037 557.631,704.78 549.908 C 697.904 544.17,692.176 538.198,677 520.942 C 663.957 506.111,664.274 506.398,662.303 507.598 C 660.744 508.547,648.113 527.779,646.276 532 C 645.917 532.825,642.729 538.195,639.191 543.934 C 635.653 549.673,631.967 555.748,631 557.434 C 630.032 559.12,624.237 568.784,618.12 578.909 C 612.004 589.033,607 597.501,607 597.725 C 607 597.95,605.875 599.608,604.5 601.411 C 603.125 603.214,602 604.958,602 605.287 C 602 605.616,597.717 612.774,592.483 621.193 C 587.249 629.612,582.59 637.175,582.131 638 C 580.519 640.896,577.421 640.246,574.026 636.3 C 572.229 634.21,568.666 630.25,566.11 627.5 C 557.549 618.29,546.467 605.575,539.524 597 C 535.74 592.325,532.143 588.05,531.532 587.5 C 530.648 586.704,521.391 575.301,517.734 570.504 C 517.313 569.952,515.963 568.355,514.734 566.955 C 511.255 562.992,494.718 542.532,482 526.456 C 478.425 521.937,471.9 513.84,467.5 508.462 C 463.1 503.085,458.033 496.731,456.24 494.342 C 454.447 491.954,452.566 490,452.058 490 C 451.191 490,447 495.227,447 496.308 C 447 496.583,445.374 499.664,443.386 503.154 C 441.399 506.644,437.286 514.225,434.246 520 C 431.206 525.775,426.965 533.796,424.821 537.825 C 420.293 546.335,418.948 548.932,418 551 C 417.622 551.825,416.851 553.4,416.286 554.5 C 409.562 567.607,404.36 584.531,402.974 597.812 C 395.376 670.614,465.216 718.42,531 685.446 C 544.569 678.645,560.264 665.739,571.262 652.339 C 579.814 641.92,580.142 641.915,591 652.025 C 602.723 662.939,623.971 677.613,636.5 683.445 C 647.81 688.709,650.512 689.791,657.5 691.852 C 689.376 701.255,730.033 699.033,757.688 686.375 C 760.542 685.069,763.105 684,763.384 684 C 767.472 684,795.768 663.032,804.125 653.81 C 810.826 646.417,823 630.758,823 629.532 C 823 629.166,824.068 627.434,825.373 625.683 C 826.679 623.932,828.877 620.475,830.259 618 C 832.966 613.151,837.498 605.422,840.139 601.151 C 841.563 598.847,847.705 588.378,854.306 577 C 855.423 575.075,857.427 571.475,858.759 569 C 860.092 566.525,861.703 563.825,862.341 563 C 862.978 562.175,864.105 560.426,864.844 559.113 C 865.583 557.8,867.099 555.1,868.213 553.113 C 869.327 551.126,874.797 541.724,880.369 532.22 C 885.941 522.716,891.653 512.814,893.062 510.217 C 894.47 507.619,897.283 502.899,899.312 499.727 C 901.34 496.556,903 493.737,903 493.463 C 903 493.189,905.25 489.337,908 484.903 C 910.75 480.469,913 476.631,913 476.373 C 913 476.115,914.575 473.442,916.5 470.433 C 918.425 467.423,920 464.723,920 464.433 C 920 464.142,921.575 461.442,923.5 458.433 C 925.425 455.423,927 452.702,927 452.385 C 927 452.068,928.013 450.396,929.25 448.668 C 930.487 446.941,931.981 444.622,932.57 443.514 C 934.226 440.394,938.416 433.014,941.661 427.5 C 947.966 416.787,956 398.394,956 394.674 C 956 393.257,956.675 389.506,957.5 386.339 C 959.395 379.063,959.405 365.305,957.52 357.5 C 956.723 354.2,956.055 350.371,956.036 348.992 C 956.016 347.613,954.875 344.371,953.5 341.788 C 952.125 339.205,951 336.597,951 335.993 C 951 333.899,940.159 318.475,935.11 313.386 C 926.131 304.335,907.79 292,903.312 292 C 902.536 292,900.461 291.235,898.7 290.3 C 888.164 284.705,864.68 282.827,847.5 286.205";
  const ICONS = () => window.WF_ICONS || {};

  const icon = (name, cls = "") =>
    `<svg class="ax-ic${cls ? " " + cls : ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS()[name] || ""}</svg>`;

  // Product marks as in the ecosystem switcher: a tinted tile with the app's glyph, like an app icon.
  const BRAIN_GLYPH = '<path d="M12 18V5"/><path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"/><path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"/><path d="M17.997 5.125a4 4 0 0 1 2.526 5.77"/><path d="M18 18a4 4 0 0 0 2-7.464"/><path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"/><path d="M6 18a4 4 0 0 1-2-7.464"/><path d="M6.003 5.125a4 4 0 0 0-2.526 5.77"/>';
  const tile = (bg, stroke, glyph) =>
    `<svg class="ax-mark" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="${bg}"/><g transform="translate(5 5) scale(.9167)" fill="none" stroke="${stroke}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${glyph}</g></svg>`;
  const productMark = (product) =>
    product === "brain" ? tile("#E7E2FF", "#3438EE", BRAIN_GLYPH)
      : product === "radar" ? tile("#DDF3E4", "#1E7B43", ICONS().radar || "")
        : tile("#FFE9D9", "#C2570C", ICONS().send || "");

  const NOT_IN_DEMO = L({ sv: "Inte med i demon", fi: "Ei mukana demossa", en: "Not in the demo" });

  /** The window: browser chrome, sidebar and the page. `nav` items: {id, label, icon, current, count, off, a}. */
  const frame = ({ product, productName, path, nav, account, body }) => `
    <div class="ax" data-product="${product}">
      <div class="ax-chrome" aria-hidden="true">
        <span class="ax-lights"><i></i><i></i><i></i></span>
        <span class="ax-url">${icon("lock")}<span>app.wicflow.com${path}</span></span>
        <span class="ax-chrome-end"></span>
      </div>
      <div class="ax-app">
        <nav class="ax-side" aria-label="${productName}">
          <div class="ax-brand"><svg class="ax-brand-mark" viewBox="319 285 640 413" fill="currentColor" aria-hidden="true"><path d="${MARK_PATH}"/></svg><span>Wicflow</span></div>
          <div class="ax-switch" title="${L({ sv: "Byt app", fi: "Vaihda sovellusta", en: "Switch app" })}">${productMark(product)}<span>${productName}</span>${icon("chevrons-up-down", "ax-dim")}</div>
          <div class="ax-navh">${productName}</div>
          <div class="ax-nav">${nav.map((item) => item.off
            ? `<span class="ax-item" aria-disabled="true" title="${NOT_IN_DEMO}">${icon(item.icon)}<span class="ax-item-l">${item.label}</span></span>`
            : `<button type="button" class="ax-item" data-a="${item.a || "view"}" data-v="${item.id}" aria-current="${item.current ? "page" : "false"}">${icon(item.icon)}<span class="ax-item-l">${item.label}</span>${item.count ? `<span class="ax-badge">${item.count}</span>` : ""}</button>`).join("")}</div>
          <div class="ax-acct"><span class="ax-avatar">${account.initials}</span><span class="ax-acct-t"><b>${account.name}</b><small>${account.role}</small></span>${icon("chevrons-up-down", "ax-dim")}</div>
        </nav>
        <section class="ax-main app-main" aria-live="polite">${body}</section>
      </div>
    </div>`;

  /** A page header: large title, subtitle, actions on the right (the shell's PageHeader). */
  const page = (title, sub = "", actions = "") =>
    `<header class="ax-head"><div class="ax-head-t"><h4 class="ax-title">${title}</h4>${sub ? `<p class="ax-sub">${sub}</p>` : ""}</div>${actions ? `<div class="ax-actions">${actions}</div>` : ""}</header>`;

  /** A card with an optional header (the shell's Card + CardHeader). */
  const card = (title, meta, inner, cls = "") =>
    `<section class="ax-card${cls ? " " + cls : ""}">${title ? `<header class="ax-card-h"><h5>${title}</h5>${meta ? `<span>${meta}</span>` : ""}</header>` : ""}${inner}</section>`;

  /** Demo controls above the window: always labelled as a demo, never part of the product. */
  const demoBar = (right) =>
    `<div class="demo-bar"><span class="demo-pill">${icon("sparkles")}${L({ sv: "Interaktiv demo · exempeldata", fi: "Interaktiivinen demo · esimerkkidata", en: "Interactive demo · sample data" })}</span><div class="demo-bar-r">${right}</div></div>`;

  /** "Try this" under the window: the tasks as a checklist, a note and, when everything is done, the next step. */
  const guide = ({ tasks = [], note = "", done = "" }) => {
    const n = tasks.filter((t) => t.done).length;
    return `<div class="demo-guide">
      ${tasks.length ? `<div class="demo-tasks"><span class="demo-tasks-h">${L({ sv: "Prova det här", fi: "Kokeile näitä", en: "Try this" })} <b>${n}/${tasks.length}</b></span>
        ${tasks.map((t) => `<span class="demo-task${t.done ? " is-done" : ""}">${icon(t.done ? "circle-check" : "check")}${t.text}</span>`).join("")}</div>` : ""}
      ${n === tasks.length && tasks.length && done ? `<div class="demo-done">${done}</div>` : ""}
      ${note ? `<p class="demo-note">${note}</p>` : ""}
    </div>`;
  };

  /** The Wicflow mark on its own (the phone demo's app icon). */
  const brandMark = (cls = "") => `<svg class="${cls}" viewBox="319 285 640 413" fill="currentColor" aria-hidden="true"><path d="${MARK_PATH}"/></svg>`;

  // The window has a fixed size and its page scrolls inside it; a redraw keeps the reader's place unless the view changed.
  const scrollOf = (root) => root.querySelector(".ax-main")?.scrollTop || 0;
  const restoreScroll = (root, top) => { const main = root.querySelector(".ax-main"); if (main && top) main.scrollTop = top; };

  // Toasts appear over the window (iOS-style), not over the controls around it.
  const toast = (root, msg) => baseToast(root.querySelector(".ax") || root, msg);

  Object.assign(window.WF, { icon, frame, page, card, demoBar, guide, toast, scrollOf, restoreScroll, brandMark });
})();
