document.querySelector('.categories').innerHTML = "Loading cheats...";
await fetch("https://raw.githubusercontent.com/Minesraft2/Blooket-Cheats/main/unobfuscated/Bookmarklets.html").then(async x => document.querySelector("#unobfuscated").contentDocument.write(await x.text().then(x => x.slice(0, x.indexOf("<style")))));
const unobfuscated = parseCheats(document.querySelector("#unobfuscated"));
window.a = unobfuscated

document.querySelector('.categories').innerHTML = "";
const icons = parseIcons(document.querySelector("#unobfuscated"));

loadPage();

window.onpopstate = loadPage;
function loadPage() {
    document.querySelector('.categories').innerHTML = "";
    const hash = decodeURI(location.hash.slice(1));
    const parent = hash.split("/").reduce((a, b) => a[b], unobfuscated);
    if (parent) {
        if (!parent) return window.location.hash = "";
        document.querySelector('h1').innerHTML = `${hash} Cheats<span style="font-size: 1rem; display: block">(Click a cheat to copy the script or drag into bookmarks bar)</span>`;
        document.querySelector('.categories').innerHTML = `<a style="width: 170px;" href="#${hash.split('/').slice(0, -1).join('/')}" class="category"><img style="width: 100%;" title="Back" alt="Back" src="${icons.Default}"><div class="cheatlabel" style="background-color: #24b6ff;">Back</div></a>`;
        for (const key in parent) createButton(key, parent, hash.split("/")[0]);
    } else {
        document.querySelector('h1').innerHTML = "Blooket Cheats";
        for (const key in unobfuscated) createButton(key, unobfuscated, typeof unobfuscated[key] == "string" && "Default");
    }
}

function createButton(key, parent, hash) {
    const category = hash && parent[key];
    const categoryElement = document.createElement("a");
    categoryElement.style.width = hash ? "135px" : "135px";
    categoryElement.href = hash ? typeof category == "string" ? category : `#${hash}/${key}` : "#" + key;
    categoryElement.classList.add("category");
    hash && (categoryElement.onclick = () => navigator.clipboard.writeText(category));
    const img = document.createElement("img");
    img.title = img.alt = key;
    img.src = parent[key].icon || parent.icon || parent.Global.icon;
    img.style.width = "100%";
    categoryElement.append(img);
    const label = document.createElement("div");
    label.classList.add(hash && typeof category == "string" ? "label" : "label");
    label.style.backgroundColor = hash && typeof category == "string" ? "#b624ff" : "#ff7b24";
    label.innerText = key;
    categoryElement.append(label);
    document.querySelector(".categories").appendChild(categoryElement);
}

function parseCheats(iframe) {
    return parseDL(iframe.contentDocument.querySelector("dl"));
    // let obj = {};
    // for (const child of iframe.contentDocument.querySelector('dl').children) {
    //     let category = obj[(child.querySelector("dl") || child).parentNode.querySelector(":scope > h3")?.innerHTML || "Default"] ||= {};
    //     for (const { innerHTML, href } of child.querySelectorAll("a")) category[innerHTML] = decodeURI(href);
    // }
    // return obj
}

function parseIcons(iframe) {
    let obj = {};
    for (const child of iframe.contentDocument.querySelector('dl').children)
        obj[(child.querySelector("dl") || child).parentNode.querySelector(":scope > h3")?.innerHTML || "Default"] = child.querySelector("a").getAttribute("icon");
    return obj
}

// Parsing Bookmarks.html files
function parseDL(dl) {
    const parsed = Array.from(dl.children).map(dt => {
        if (dt.querySelector('h3')) return [dt.querySelector("h3").innerText, parseDL(dt.querySelector("dl")), dt.querySelector("a").getAttribute("icon")];
        return [dt.innerText, decodeURI(dt.querySelector('a').href), dt.querySelector('a').getAttribute("icon")];
    }).reduce(function reduce(obj, [key, value, icon]) {
        obj[key] = value;
        typeof value == "object" && Object.defineProperty(obj[key], "icon", { value: icon });
        return obj;
    }, {});

    // parsed.Global && Object.defineProperty(parsed, "icon", { value: parsed.Global.icon });
    return parsed;
}