# farsitype-for-react
old FarsiType.js for react with onChange support
originally created by: https://farsitype.ir

retuned and optimized plus fixed some issues for react by Navid Dezashibi (Knavels)

setup guide:

1. `import { convert_to_farsi } from "farsi";`
2. `<Input type="text" name="fname" id="fname" onKeyPress={convert_to_farsi} onChange={(v) => console.log(v.target.value)} />`

that's it ;)
