// ==UserScript==
// @name IITC Plugin: helpful copyables
// @id helpfulcopyables
// @category Info
// @version 0.1.1
// @description Copies various info to clipboard on click.
// @author tehstone
// @namespace    https://github.com/tehstone/assorted-iitc-scripts/
// @downloadURL  https://github.com/tehstone/assorted-iitc-scripts/raw/main/helpful-copyables.user.js
// @include https://intel.ingress.com/*
// @match https://intel.ingress.com/*
// @grant none
// ==/UserScript==

function wrapper(plugin_info) {

    // Make sure that window.plugin exists. IITC defines it as a no-op function,
    // and other plugins assume the same.
    if (typeof window.plugin !== "function") window.plugin = function () {};

    window.plugin.PortalOpenInGame = function () {};
    const thisPlugin = window.plugin.HelpfulCopyables;

    // Name of the IITC build for first-party plugins
    plugin_info.buildName = "HelpfulCopyables";

    // Datetime-derived version of the plugin
    plugin_info.dateTimeVersion = "202204071421";

    // ID/name of the plugin
    plugin_info.pluginId = "helpfulcopyables";

    const setup = function() {
        window.addHook('portalDetailsUpdated', function(data) {
            const guid = data.guid;
            const lat = data.portalData.latE6 / 1000000;
            const lng = data.portalData.lngE6 / 1000000;
            const url = `https://intel.ingress.com/?pll=${lat},${lng}`;
            const durl = `https://link.ingress.com/?link=https%3a%2f%2fintel.ingress.com%2Fportal%2f${guid}&apn=com.nianticproject.ingress&isi=576505181&ibi=com.google.ingress&ifl=https%3a%2f%2fapps.apple.com%2fapp%2fingress%2fid576505181&ofl=https%3a%2f%2fintel.ingress.com%2fintel%3fpll%3d${lat}%2c${lng}`;
            const title = data.portalData.title;

            const guidLink = document.createElement('a');
            guidLink.textContent = guid;
            guidLink.addEventListener('click', function(e) {
                navigator.clipboard.writeText(`${guid}`);
                clickColor(e);
            });

            const copyLink = document.createElement('a');
            copyLink.textContent = 'Copy Name & Link';
            copyLink.addEventListener('click', function(e) {
                if (window.isSmartphone()) {
                    alert(`${title}\n${url}`);
                } else {
                    navigator.clipboard.writeText(`${title}\n${url}`);
                }
                clickColor(e);
            });

            const copyDLink = document.createElement('a');
            copyDLink.textContent = 'Copy Dynamic Link';
            copyDLink.addEventListener('click', function(e) {
                if (window.isSmartphone()) {
                    alert(`${title}\n${durl}`);
                } else {
                    navigator.clipboard.writeText(`${title}\n${durl}`);
                }
                clickColor(e);
            });

            const copyGpsLink = document.createElement('a');
            copyGpsLink.textContent = `${lat},${lng}`;
            copyGpsLink.addEventListener('click', function(e) {
                if (window.isSmartphone()) {
                    alert(`${lat},${lng}`);
                } else {
                    navigator.clipboard.writeText(`${title}\n${durl}`);
                }
                clickColor(e);
            });

            const gdiv = document.createElement('div');
            const cdiv = document.createElement('div');
            const ddiv = document.createElement('div');
            const gpsdiv = document.createElement('div');
            gdiv.appendChild(guidLink);
            cdiv.appendChild(copyLink);
            ddiv.appendChild(copyDLink);
            gpsdiv.appendChild(copyGpsLink);

            const aside = document.createElement('aside');
            aside.appendChild(cdiv);
            aside.appendChild(ddiv);
            aside.appendChild(gpsdiv);
            aside.appendChild(gdiv);

            $("div.linkdetails").append(aside);
        });
    }

    const clickColor = function(e) {
        e.target.style.color = "#00FF00";
        setTimeout(function (e){
            e.target.style.color = '#F9CC03';
        }, 1000, e);
    }

    setup.info = plugin_info;
    if (window.iitcLoaded) {
        setup();
        } else {
            if (!window.bootPlugins) {
                window.bootPlugins = [];
            }
        window.bootPlugins.push(setup);
    }
}

(function () {
    const plugin_info = {};
    if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) {
        plugin_info.script = {
            version: GM_info.script.version,
            name: GM_info.script.name,
            description: GM_info.script.description
        };
    }
    // Greasemonkey. It will be quite hard to debug
    if (typeof unsafeWindow != 'undefined' || typeof GM_info == 'undefined' || GM_info.scriptHandler != 'Tampermonkey') {
    // inject code into site context
        const script = document.createElement('script');
        script.appendChild(document.createTextNode('(' + wrapper + ')(' + JSON.stringify(plugin_info) + ');'));
        (document.body || document.head || document.documentElement).appendChild(script);
    } else {
        // Tampermonkey, run code directly
        wrapper(plugin_info);
    }
})();
