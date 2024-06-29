
import { IResourceDescriptor } from "./IResourceDescriptor";

//to change this code modify resource-loader-generator/app.js

const resources = new Map<string, IResourceDescriptor>();


resources.set("fonts/KaTeX_AMS-Regular.ttf", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_AMS-Regular.ttf").default.toString(),
    mimeType: "font/ttf"
});


resources.set("fonts/KaTeX_AMS-Regular.woff", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_AMS-Regular.woff").default.toString(),
    mimeType: "font/woff"
});


resources.set("fonts/KaTeX_AMS-Regular.woff2", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_AMS-Regular.woff2").default.toString(),
    mimeType: "font/woff2"
});


resources.set("fonts/KaTeX_Caligraphic-Bold.ttf", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Caligraphic-Bold.ttf").default.toString(),
    mimeType: "font/ttf"
});


resources.set("fonts/KaTeX_Caligraphic-Bold.woff", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Caligraphic-Bold.woff").default.toString(),
    mimeType: "font/woff"
});


resources.set("fonts/KaTeX_Caligraphic-Bold.woff2", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Caligraphic-Bold.woff2").default.toString(),
    mimeType: "font/woff2"
});


resources.set("fonts/KaTeX_Caligraphic-Regular.ttf", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Caligraphic-Regular.ttf").default.toString(),
    mimeType: "font/ttf"
});


resources.set("fonts/KaTeX_Caligraphic-Regular.woff", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Caligraphic-Regular.woff").default.toString(),
    mimeType: "font/woff"
});


resources.set("fonts/KaTeX_Caligraphic-Regular.woff2", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Caligraphic-Regular.woff2").default.toString(),
    mimeType: "font/woff2"
});


resources.set("fonts/KaTeX_Fraktur-Bold.ttf", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Fraktur-Bold.ttf").default.toString(),
    mimeType: "font/ttf"
});


resources.set("fonts/KaTeX_Fraktur-Bold.woff", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Fraktur-Bold.woff").default.toString(),
    mimeType: "font/woff"
});


resources.set("fonts/KaTeX_Fraktur-Bold.woff2", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Fraktur-Bold.woff2").default.toString(),
    mimeType: "font/woff2"
});


resources.set("fonts/KaTeX_Fraktur-Regular.ttf", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Fraktur-Regular.ttf").default.toString(),
    mimeType: "font/ttf"
});


resources.set("fonts/KaTeX_Fraktur-Regular.woff", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Fraktur-Regular.woff").default.toString(),
    mimeType: "font/woff"
});


resources.set("fonts/KaTeX_Fraktur-Regular.woff2", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Fraktur-Regular.woff2").default.toString(),
    mimeType: "font/woff2"
});


resources.set("fonts/KaTeX_Main-Bold.ttf", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Main-Bold.ttf").default.toString(),
    mimeType: "font/ttf"
});


resources.set("fonts/KaTeX_Main-Bold.woff", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Main-Bold.woff").default.toString(),
    mimeType: "font/woff"
});


resources.set("fonts/KaTeX_Main-Bold.woff2", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Main-Bold.woff2").default.toString(),
    mimeType: "font/woff2"
});


resources.set("fonts/KaTeX_Main-BoldItalic.ttf", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Main-BoldItalic.ttf").default.toString(),
    mimeType: "font/ttf"
});


resources.set("fonts/KaTeX_Main-BoldItalic.woff", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Main-BoldItalic.woff").default.toString(),
    mimeType: "font/woff"
});


resources.set("fonts/KaTeX_Main-BoldItalic.woff2", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Main-BoldItalic.woff2").default.toString(),
    mimeType: "font/woff2"
});


resources.set("fonts/KaTeX_Main-Italic.ttf", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Main-Italic.ttf").default.toString(),
    mimeType: "font/ttf"
});


resources.set("fonts/KaTeX_Main-Italic.woff", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Main-Italic.woff").default.toString(),
    mimeType: "font/woff"
});


resources.set("fonts/KaTeX_Main-Italic.woff2", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Main-Italic.woff2").default.toString(),
    mimeType: "font/woff2"
});


resources.set("fonts/KaTeX_Main-Regular.ttf", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Main-Regular.ttf").default.toString(),
    mimeType: "font/ttf"
});


resources.set("fonts/KaTeX_Main-Regular.woff", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Main-Regular.woff").default.toString(),
    mimeType: "font/woff"
});


resources.set("fonts/KaTeX_Main-Regular.woff2", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Main-Regular.woff2").default.toString(),
    mimeType: "font/woff2"
});


resources.set("fonts/KaTeX_Math-BoldItalic.ttf", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Math-BoldItalic.ttf").default.toString(),
    mimeType: "font/ttf"
});


resources.set("fonts/KaTeX_Math-BoldItalic.woff", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Math-BoldItalic.woff").default.toString(),
    mimeType: "font/woff"
});


resources.set("fonts/KaTeX_Math-BoldItalic.woff2", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Math-BoldItalic.woff2").default.toString(),
    mimeType: "font/woff2"
});


resources.set("fonts/KaTeX_Math-Italic.ttf", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Math-Italic.ttf").default.toString(),
    mimeType: "font/ttf"
});


resources.set("fonts/KaTeX_Math-Italic.woff", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Math-Italic.woff").default.toString(),
    mimeType: "font/woff"
});


resources.set("fonts/KaTeX_Math-Italic.woff2", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Math-Italic.woff2").default.toString(),
    mimeType: "font/woff2"
});


resources.set("fonts/KaTeX_SansSerif-Bold.ttf", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_SansSerif-Bold.ttf").default.toString(),
    mimeType: "font/ttf"
});


resources.set("fonts/KaTeX_SansSerif-Bold.woff", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_SansSerif-Bold.woff").default.toString(),
    mimeType: "font/woff"
});


resources.set("fonts/KaTeX_SansSerif-Bold.woff2", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_SansSerif-Bold.woff2").default.toString(),
    mimeType: "font/woff2"
});


resources.set("fonts/KaTeX_SansSerif-Italic.ttf", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_SansSerif-Italic.ttf").default.toString(),
    mimeType: "font/ttf"
});


resources.set("fonts/KaTeX_SansSerif-Italic.woff", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_SansSerif-Italic.woff").default.toString(),
    mimeType: "font/woff"
});


resources.set("fonts/KaTeX_SansSerif-Italic.woff2", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_SansSerif-Italic.woff2").default.toString(),
    mimeType: "font/woff2"
});


resources.set("fonts/KaTeX_SansSerif-Regular.ttf", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_SansSerif-Regular.ttf").default.toString(),
    mimeType: "font/ttf"
});


resources.set("fonts/KaTeX_SansSerif-Regular.woff", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_SansSerif-Regular.woff").default.toString(),
    mimeType: "font/woff"
});


resources.set("fonts/KaTeX_SansSerif-Regular.woff2", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_SansSerif-Regular.woff2").default.toString(),
    mimeType: "font/woff2"
});


resources.set("fonts/KaTeX_Script-Regular.ttf", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Script-Regular.ttf").default.toString(),
    mimeType: "font/ttf"
});


resources.set("fonts/KaTeX_Script-Regular.woff", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Script-Regular.woff").default.toString(),
    mimeType: "font/woff"
});


resources.set("fonts/KaTeX_Script-Regular.woff2", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Script-Regular.woff2").default.toString(),
    mimeType: "font/woff2"
});


resources.set("fonts/KaTeX_Size1-Regular.ttf", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Size1-Regular.ttf").default.toString(),
    mimeType: "font/ttf"
});


resources.set("fonts/KaTeX_Size1-Regular.woff", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Size1-Regular.woff").default.toString(),
    mimeType: "font/woff"
});


resources.set("fonts/KaTeX_Size1-Regular.woff2", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Size1-Regular.woff2").default.toString(),
    mimeType: "font/woff2"
});


resources.set("fonts/KaTeX_Size2-Regular.ttf", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Size2-Regular.ttf").default.toString(),
    mimeType: "font/ttf"
});


resources.set("fonts/KaTeX_Size2-Regular.woff", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Size2-Regular.woff").default.toString(),
    mimeType: "font/woff"
});


resources.set("fonts/KaTeX_Size2-Regular.woff2", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Size2-Regular.woff2").default.toString(),
    mimeType: "font/woff2"
});


resources.set("fonts/KaTeX_Size3-Regular.ttf", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Size3-Regular.ttf").default.toString(),
    mimeType: "font/ttf"
});


resources.set("fonts/KaTeX_Size3-Regular.woff", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Size3-Regular.woff").default.toString(),
    mimeType: "font/woff"
});


resources.set("fonts/KaTeX_Size3-Regular.woff2", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Size3-Regular.woff2").default.toString(),
    mimeType: "font/woff2"
});


resources.set("fonts/KaTeX_Size4-Regular.ttf", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Size4-Regular.ttf").default.toString(),
    mimeType: "font/ttf"
});


resources.set("fonts/KaTeX_Size4-Regular.woff", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Size4-Regular.woff").default.toString(),
    mimeType: "font/woff"
});


resources.set("fonts/KaTeX_Size4-Regular.woff2", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Size4-Regular.woff2").default.toString(),
    mimeType: "font/woff2"
});


resources.set("fonts/KaTeX_Typewriter-Regular.ttf", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Typewriter-Regular.ttf").default.toString(),
    mimeType: "font/ttf"
});


resources.set("fonts/KaTeX_Typewriter-Regular.woff", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Typewriter-Regular.woff").default.toString(),
    mimeType: "font/woff"
});


resources.set("fonts/KaTeX_Typewriter-Regular.woff2", {
    content: require("../../node_modules/katex/dist/fonts/KaTeX_Typewriter-Regular.woff2").default.toString(),
    mimeType: "font/woff2"
});

export default resources;

