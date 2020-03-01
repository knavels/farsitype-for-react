// Originally by http://www.farsitype.ir/
// renewed and tuned (redeveloped) by Navid Dezashibi (Knavels)

export const FarsiType = {
    // Farsi keyboard map based on Iran Popular Keyboard Layout
    farsiKey: [
        32, 33, 34, 35, 36, 37, 1548, 1711,
        41, 40, 215, 43, 1608, 45, 46, 47,
        48, 49, 50, 51, 52, 53, 54, 55,
        56, 57, 58, 1705, 44, 61, 46, 1567,
        64, 1616, 1584, 125, 1609, 1615, 1609, 1604,
        1570, 247, 1600, 1548, 47, 8217, 1583, 215,
        1563, 1614, 1569, 1613, 1601, 8216, 123, 1611,
        1618, 1573, 126, 1580, 1688, 1670, 94, 95,
        1662, 1588, 1584, 1586, 1740, 1579, 1576, 1604,
        1575, 1607, 1578, 1606, 1605, 1574, 1583, 1582,
        1581, 1590, 1602, 1587, 1601, 1593, 1585, 1589,
        1591, 1594, 1592, 60, 124, 62, 1617
    ],
    Type: true,
    counter: 0,
    ShowChangeLangButton: 0,	// 0: Hidden / 1: Visible
    KeyBoardError: 0,			// 0: Disable FarsiType / 1: Show Error
    ChangeDir: 1,			// 0: No Action / 1: Do Rtl-Ltr / 2: Rtl-Ltr button
    UnSupportedAction: 0		//0: Disable FarsiType / 1: Low Support
}

export const convert_to_farsi = (e) => {

    // if (e == null)
    //     e = window.event;

    let key = e.which || e.charCode || e.keyCode;
    const eElement = e.target || e.originalTarget || e.srcElement;

    if (FarsiType.Type) {
        if (
            (e.charCode != null && e.charCode != key) ||
            (e.which != null && e.which != key) ||
            (e.ctrlKey || e.altKey || e.metaKey) ||
            (key == 13 || key == 27 || key == 8)
        ) return true;

        //check windows lang
        if (key > 128) {
            return key;
        }

        // If Farsi
        if (FarsiType.Type) {

            //check CpasLock
            if ((key >= 65 && key <= 90 && !e.shiftKey) || (key >= 97 && key <= 122) && e.shiftKey) {
                alert("Caps Lock is On. To prevent entering farsi incorrectly, you should press Caps Lock to turn it off.");
                return false;
            }

            // Shift-space -> ZWNJ
            if (key === 32 && e.shiftKey)
                key = 8204;
            else
                key = FarsiType.farsiKey[key - 32];

            key = typeof key == 'string' ? key : String.fromCharCode(key);

            // to farsi
            try {

                const docSelection = document.selection;
                const selectionStart = eElement.selectionStart;
                const selectionEnd = eElement.selectionEnd;

                if (typeof selectionStart == 'number') {
                    //FOR W3C STANDARD BROWSERS
                    const nScrollTop = eElement.scrollTop;
                    const nScrollLeft = eElement.scrollLeft;
                    const nScrollWidth = eElement.scrollWidth;

                    // eElement.value = eElement.value.substring(0, selectionStart) + key + eElement.value.substring(selectionEnd);

                    setNativeValue(eElement, eElement.value.substring(0, selectionStart) + key + eElement.value.substring(selectionEnd))
                    eElement.dispatchEvent(new Event('input', { bubbles: true }));

                    // e.preventDefault();
                    // console.log(eElement.value)
                    // return;
                    // setSelectionRange(eElement, selectionStart + key.length, selectionStart + key.length);

                    const nW = eElement.scrollWidth - nScrollWidth;
                    if (eElement.scrollTop == 0) { eElement.scrollTop = nScrollTop }
                } else if (docSelection) {
                    const nRange = docSelection.createRange();
                    nRange.text = key;
                    nRange.setEndPoint('StartToEnd', nRange);
                    nRange.select();
                }

            } catch (error) {
                try {
                    // IE
                    e.keyCode = key
                } catch (error) {
                    try {
                        // OLD GECKO
                        e.initKeyEvent("keypress", true, true, document.defaultView, false, false, true, false, 0, key, eElement);
                    } catch (error) {
                        //OTHERWISE
                        if (FarsiType.UnSupportedAction == 0) {
                            alert('Sorry! no FarsiType support')
                            FarsiType.Disable();
                            const Dis = document.getElementById('disableFarsiType')
                            if (Dis != null) {
                                Dis.disabled = true;
                            }
                            return false;
                        } else {
                            eElement.value += key;
                        }
                    }
                }
            }

            if (e.preventDefault) {
                e.preventDefault();
            }


        }
    }
    return true;
}

export function setNativeValue(element, value) {
    const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
    const prototype = Object.getPrototypeOf(element);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

    if (valueSetter && valueSetter !== prototypeValueSetter) {
        prototypeValueSetter.call(element, value);
    } else {
        valueSetter.call(element, value);
    }
}
