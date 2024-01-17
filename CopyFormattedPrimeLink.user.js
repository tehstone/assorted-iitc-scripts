// ==UserScript==
// @name IITC Plugin: Copy Formatted D-Link
// @id formatteddlink
// @category Info
// @version 0.1.1
// @description Copies formatted dynamic link to clipboard on click.
// @author tehstone
// @include https://intel.ingress.com/*
// @match https://intel.ingress.com/*
// @grant none
// ==/UserScript==

function wrapper(plugin_info) {

    // Make sure that window.plugin exists. IITC defines it as a no-op function,
    // and other plugins assume the same.
    if (typeof window.plugin !== "function") window.plugin = function () {};

    window.plugin.PortalOpenInGame = function () {};
    const thisPlugin = window.plugin.FormattedDLink;

    // Name of the IITC build for first-party plugins
    plugin_info.buildName = "FormattedDLink";

    // Datetime-derived version of the plugin
    plugin_info.dateTimeVersion = "202401081557";

    // ID/name of the plugin
    plugin_info.pluginId = "formatteddlink";

    const setup = function() {
        window.addHook('portalDetailsUpdated', function(data) {
            const guid = data.guid;
            const lat = data.portalData.latE6 / 1000000;
            const lng = data.portalData.lngE6 / 1000000;
            const durl = `https://link.ingress.com/?link=https%3a%2f%2fintel.ingress.com%2Fportal%2f${guid}&apn=com.nianticproject.ingress&isi=576505181&ibi=com.google.ingress&ifl=https%3a%2f%2fapps.apple.com%2fapp%2fingress%2fid576505181&ofl=https%3a%2f%2fintel.ingress.com%2fintel%3fpll%3d${lat}%2c${lng}`;
            const title = data.portalData.title;
            const formattedLink = `[${title}](<${durl}>)`;

            const copyDLink = document.createElement('a');
            copyDLink.textContent = 'Dynamic Link';
            copyDLink.addEventListener('click', function(e) {
                if (window.isSmartphone()) {
                    alert(`${formattedLink}`);
                } else {
                    navigator.clipboard.writeText(`${formattedLink}`);
                }
                clickColor(e);
            });

            const linkAside = document.createElement('aside');
            linkAside.appendChild(copyDLink);


            const linkDiv = document.createElement('div');
            linkDiv.append(linkAside);

            const linkParentDiv = $("div.linkdetails");
            const existingAsides = linkParentDiv[0].childNodes;
            if (existingAsides.length >= 2) {
                existingAsides[1].remove();
                existingAsides[0].remove();
            }
            linkParentDiv.append(linkDiv);
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
