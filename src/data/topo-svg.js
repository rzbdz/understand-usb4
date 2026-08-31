// USB4 Gen T / Gen X tunneling figures — SVG ported 1:1 from the user-provided
// reference drawing (svg.html, style of USB4 spec Figure 2-24 / 2-19).
// Tunnel path elements carry data-seg="N" for step highlighting.

const GT_SVG = `
  <marker id="arrGTG" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#b9b9b9"/></marker>
  <marker id="arrGTC" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#0a84ff"/></marker>
  <marker id="arrGTA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#d97706"/></marker>

  <rect x="20" y="35" width="840" height="265" fill="none" stroke="#000" stroke-width="1.5"/>
  <text x="45" y="60" font-size="16" font-weight="bold">USB4 Host</text>
  <rect x="260" y="55" width="400" height="230" fill="#c8c8c8" stroke="#000" stroke-width="1"/>
  <text x="430" y="170" font-size="15" font-weight="bold" text-anchor="middle">Host Router</text>
  <rect x="400" y="65" width="110" height="30" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="455" y="84" font-size="11" text-anchor="middle">Host I/F</text>
  <text x="455" y="96" font-size="11" text-anchor="middle">Adapter</text>
  <rect x="275" y="110" width="95" height="32" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="322" y="130" font-size="11" text-anchor="middle">DP IN</text>
  <text x="322" y="142" font-size="11" text-anchor="middle">Adapter</text>
  <rect x="275" y="155" width="95" height="32" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="322" y="175" font-size="11" text-anchor="middle">PCIe DN</text>
  <text x="322" y="187" font-size="11" text-anchor="middle">Adapter</text>
  <rect x="275" y="200" width="95" height="32" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="322" y="220" font-size="11" text-anchor="middle">PCIe DN</text>
  <text x="322" y="232" font-size="11" text-anchor="middle">Adapter</text>
  <rect x="385" y="250" width="85" height="28" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="427" y="268" font-size="11" text-anchor="middle">USB4 Port</text>
  <rect x="480" y="250" width="85" height="28" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="522" y="268" font-size="11" text-anchor="middle">USB4 Port</text>
  <rect x="580" y="145" width="70" height="32" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="615" y="164" font-size="10" text-anchor="middle">USB3 Gen T</text>
  <text x="615" y="176" font-size="10" text-anchor="middle">DN Adapter</text>
  <rect x="580" y="190" width="70" height="32" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="615" y="209" font-size="10" text-anchor="middle">USB3 Gen X</text>
  <text x="615" y="221" font-size="10" text-anchor="middle">DN Adapter</text>
  <rect x="60" y="95" width="110" height="35" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="115" y="117" font-size="12" text-anchor="middle">DP Source</text>
  <rect x="50" y="155" width="130" height="35" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="115" y="177" font-size="12" text-anchor="middle">PCIe Controller</text>
  <rect x="680" y="60" width="165" height="55" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="762" y="80" font-size="11" text-anchor="middle">Enhanced SuperSpeed</text>
  <text x="762" y="94" font-size="11" text-anchor="middle">Host Controller</text>
  <rect x="690" y="100" width="48" height="14" fill="#d0d0d0" stroke="#000" stroke-width="0.5"/>
  <text x="714" y="111" font-size="9" text-anchor="middle">Gen T DFP</text>
  <rect x="742" y="100" width="48" height="14" fill="#d0d0d0" stroke="#000" stroke-width="0.5"/>
  <text x="766" y="111" font-size="9" text-anchor="middle">Gen T DFP</text>
  <rect x="794" y="100" width="48" height="14" fill="#d0d0d0" stroke="#000" stroke-width="0.5"/>
  <text x="818" y="111" font-size="9" text-anchor="middle">Gen X DFP</text>
  <rect x="710" y="195" width="105" height="35" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="762" y="217" font-size="12" text-anchor="middle">USB 2.0 Host</text>

  <line x1="170" y1="112" x2="275" y2="126" stroke="#000" stroke-width="1" marker-end="url(#arrTthin)"/>
  <line x1="180" y1="172" x2="275" y2="171" stroke="#000" stroke-width="1" marker-end="url(#arrTthin)"/>
  <line x1="180" y1="172" x2="275" y2="216" stroke="#000" stroke-width="1" marker-end="url(#arrTthin)"/>
  <line x1="762" y1="230" x2="762" y2="290" stroke="#000" stroke-width="1"/>
  <line x1="762" y1="290" x2="522" y2="290" stroke="#000" stroke-width="1"/>
  <line x1="522" y1="290" x2="522" y2="278" stroke="#000" stroke-width="1" marker-end="url(#arrTthin)"/>

  <path class="seg arrowed" data-seg="0" d="M 720 115 L 680 115 L 680 161 L 650 161" stroke="#000" stroke-width="3" fill="none"/>
  <path class="seg arrowed" data-seg="1" d="M 615 177 L 615 240 L 522 240 L 522 250" stroke="#000" stroke-width="3" fill="none"/>

  <ellipse cx="427" cy="310" rx="35" ry="14" fill="#b0b0b0" stroke="#000" stroke-width="1"/>
  <ellipse class="seg" data-seg="2" cx="522" cy="310" rx="35" ry="14" fill="#b0b0b0" stroke="#000" stroke-width="1"/>
  <line x1="427" y1="278" x2="427" y2="296" stroke="#000" stroke-width="1"/>
  <line class="seg" data-seg="2" x1="522" y1="278" x2="522" y2="296" stroke="#000" stroke-width="3"/>
  <line x1="427" y1="324" x2="427" y2="345" stroke="#000" stroke-width="1"/>
  <line class="seg" data-seg="2" x1="522" y1="324" x2="522" y2="345" stroke="#000" stroke-width="3"/>

  <rect x="20" y="330" width="840" height="290" fill="none" stroke="#000" stroke-width="1.5"/>
  <text x="45" y="355" font-size="16" font-weight="bold">USB4 Hub</text>
  <rect x="260" y="360" width="400" height="245" fill="#c8c8c8" stroke="#000" stroke-width="1"/>
  <text x="430" y="480" font-size="15" font-weight="bold" text-anchor="middle">Device Router</text>
  <rect x="275" y="375" width="95" height="32" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="322" y="395" font-size="11" text-anchor="middle">DP OUT</text>
  <text x="322" y="407" font-size="11" text-anchor="middle">Adapter</text>
  <rect x="275" y="420" width="95" height="32" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="322" y="440" font-size="11" text-anchor="middle">PCIe UP</text>
  <text x="322" y="452" font-size="11" text-anchor="middle">Adapter</text>
  <rect x="275" y="465" width="95" height="32" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="322" y="485" font-size="11" text-anchor="middle">PCIe DN</text>
  <text x="322" y="497" font-size="11" text-anchor="middle">Adapter</text>
  <rect x="275" y="510" width="95" height="32" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="322" y="530" font-size="11" text-anchor="middle">PCIe DN</text>
  <text x="322" y="542" font-size="11" text-anchor="middle">Adapter</text>
  <rect x="385" y="375" width="85" height="28" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="427" y="393" font-size="11" text-anchor="middle">USB4 Port</text>
  <rect x="385" y="570" width="85" height="28" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="427" y="588" font-size="11" text-anchor="middle">USB4 Port</text>
  <rect x="480" y="570" width="85" height="28" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="522" y="588" font-size="11" text-anchor="middle">USB4 Port</text>
  <rect x="580" y="410" width="70" height="32" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="615" y="429" font-size="10" text-anchor="middle">USB3 Gen X</text>
  <text x="615" y="441" font-size="10" text-anchor="middle">UP Adapter</text>
  <rect x="580" y="500" width="70" height="32" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="615" y="519" font-size="10" text-anchor="middle">USB3 Gen X</text>
  <text x="615" y="531" font-size="10" text-anchor="middle">DN Adapter</text>
  <rect x="580" y="545" width="70" height="32" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="615" y="564" font-size="10" text-anchor="middle">USB3 Gen X</text>
  <text x="615" y="576" font-size="10" text-anchor="middle">DN Adapter</text>
  <rect x="60" y="455" width="115" height="40" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="117" y="479" font-size="12" text-anchor="middle">PCIe Switch</text>
  <rect x="680" y="430" width="155" height="50" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="757" y="452" font-size="11" text-anchor="middle">Enhanced</text>
  <text x="757" y="466" font-size="11" text-anchor="middle">SuperSpeed Hub</text>
  <rect x="710" y="370" width="105" height="35" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="762" y="392" font-size="12" text-anchor="middle">USB 2.0 Hub</text>

  <line x1="175" y1="465" x2="275" y2="436" stroke="#000" stroke-width="1" marker-end="url(#arrTthin)"/>
  <line x1="175" y1="475" x2="275" y2="481" stroke="#000" stroke-width="1" marker-end="url(#arrTthin)"/>
  <line x1="175" y1="485" x2="275" y2="526" stroke="#000" stroke-width="1" marker-end="url(#arrTthin)"/>
  <line x1="762" y1="405" x2="762" y2="345" stroke="#000" stroke-width="1"/>
  <line x1="762" y1="345" x2="427" y2="345" stroke="#000" stroke-width="1"/>
  <line x1="427" y1="345" x2="427" y2="375" stroke="#000" stroke-width="1" marker-end="url(#arrTthin)"/>
  <line x1="762" y1="480" x2="762" y2="600" stroke="#000" stroke-width="1"/>
  <line x1="762" y1="600" x2="522" y2="600" stroke="#000" stroke-width="1"/>
  <line x1="522" y1="600" x2="522" y2="598" stroke="#000" stroke-width="1" marker-end="url(#arrTthin)"/>

  <path class="seg arrowed" data-seg="3" d="M 522 345 L 522 375 L 522 570 L 522 598" stroke="#000" stroke-width="3" fill="none"/>

  <ellipse cx="427" cy="640" rx="35" ry="14" fill="#b0b0b0" stroke="#000" stroke-width="1"/>
  <ellipse class="seg" data-seg="4" cx="522" cy="640" rx="35" ry="14" fill="#b0b0b0" stroke="#000" stroke-width="1"/>
  <line x1="427" y1="598" x2="427" y2="626" stroke="#000" stroke-width="1"/>
  <line class="seg" data-seg="4" x1="522" y1="598" x2="522" y2="626" stroke="#000" stroke-width="3"/>
  <line x1="427" y1="654" x2="427" y2="675" stroke="#000" stroke-width="1"/>
  <line class="seg" data-seg="4" x1="522" y1="654" x2="522" y2="675" stroke="#000" stroke-width="3"/>

  <rect x="20" y="660" width="840" height="290" fill="none" stroke="#000" stroke-width="1.5"/>
  <text x="45" y="685" font-size="16" font-weight="bold">USB4 Device</text>
  <rect x="260" y="690" width="400" height="240" fill="#c8c8c8" stroke="#000" stroke-width="1"/>
  <text x="430" y="810" font-size="15" font-weight="bold" text-anchor="middle">Device Router</text>
  <rect x="275" y="710" width="95" height="32" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="322" y="730" font-size="11" text-anchor="middle">PCIe UP</text>
  <text x="322" y="742" font-size="11" text-anchor="middle">Adapter</text>
  <rect x="275" y="790" width="95" height="32" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="322" y="810" font-size="11" text-anchor="middle">DP OUT</text>
  <text x="322" y="822" font-size="11" text-anchor="middle">Adapter</text>
  <rect x="385" y="710" width="85" height="28" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="427" y="728" font-size="11" text-anchor="middle">USB4 Port</text>
  <rect x="580" y="750" width="70" height="32" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="615" y="769" font-size="10" text-anchor="middle">USB3 Gen X</text>
  <text x="615" y="781" font-size="10" text-anchor="middle">UP Adapter</text>
  <rect x="580" y="795" width="70" height="32" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="615" y="814" font-size="10" text-anchor="middle">USB3 Gen T</text>
  <text x="615" y="826" font-size="10" text-anchor="middle">UP Adapter</text>
  <rect x="60" y="725" width="115" height="35" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="117" y="747" font-size="12" text-anchor="middle">PCIe Function</text>
  <rect x="70" y="805" width="95" height="35" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="117" y="827" font-size="12" text-anchor="middle">DP Sink</text>
  <rect x="680" y="790" width="165" height="55" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="762" y="810" font-size="11" text-anchor="middle">Enhanced SuperSpeed</text>
  <text x="762" y="824" font-size="11" text-anchor="middle">Peripheral</text>
  <rect x="690" y="830" width="52" height="14" fill="#d0d0d0" stroke="#000" stroke-width="0.5"/>
  <text x="716" y="841" font-size="9" text-anchor="middle">Gen T UFP</text>
  <rect x="748" y="830" width="52" height="14" fill="#d0d0d0" stroke="#000" stroke-width="0.5"/>
  <text x="774" y="841" font-size="9" text-anchor="middle">Gen X UFP</text>
  <rect x="710" y="710" width="105" height="35" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="762" y="732" font-size="12" text-anchor="middle">USB 2.0 Function</text>

  <line x1="175" y1="742" x2="275" y2="726" stroke="#000" stroke-width="1" marker-end="url(#arrTthin)"/>
  <line x1="165" y1="822" x2="275" y2="806" stroke="#000" stroke-width="1" marker-end="url(#arrTthin)"/>
  <line x1="762" y1="745" x2="762" y2="675" stroke="#000" stroke-width="1"/>
  <line x1="762" y1="675" x2="427" y2="675" stroke="#000" stroke-width="1"/>
  <line x1="427" y1="675" x2="427" y2="710" stroke="#000" stroke-width="1" marker-end="url(#arrTthin)"/>

  <path class="seg arrowed" data-seg="4" d="M 522 654 L 522 675 L 427 675 L 427 710" stroke="#000" stroke-width="3" fill="none"/>
  <path class="seg arrowed" data-seg="5" d="M 470 724 L 580 724 L 580 811 L 615 811" stroke="#000" stroke-width="3" fill="none"/>
  <path class="seg arrowed" data-seg="6" d="M 650 811 L 680 811" stroke="#000" stroke-width="3" fill="none"/>

  <text x="545" y="470" font-size="10" fill="#333" font-style="italic">Gen T 隧道</text>
  <text x="545" y="484" font-size="10" fill="#333" font-style="italic">直接穿透</text>
`;

const GX_SVG = `
  <marker id="arrGXG" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#b9b9b9"/></marker>
  <marker id="arrGXC" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#0a84ff"/></marker>
  <marker id="arrGXA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#d97706"/></marker>

  <rect x="20" y="35" width="840" height="265" fill="none" stroke="#000" stroke-width="1.5"/>
  <text x="45" y="60" font-size="16" font-weight="bold">USB4 Host</text>
  <rect x="260" y="55" width="400" height="230" fill="#c8c8c8" stroke="#000" stroke-width="1"/>
  <text x="430" y="170" font-size="15" font-weight="bold" text-anchor="middle">Host Router</text>
  <rect x="400" y="65" width="110" height="30" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="455" y="84" font-size="11" text-anchor="middle">Host I/F</text>
  <text x="455" y="96" font-size="11" text-anchor="middle">Adapter</text>
  <rect x="275" y="110" width="95" height="32" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="322" y="130" font-size="11" text-anchor="middle">DP IN</text>
  <text x="322" y="142" font-size="11" text-anchor="middle">Adapter</text>
  <rect x="275" y="155" width="95" height="32" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="322" y="175" font-size="11" text-anchor="middle">PCIe DN</text>
  <text x="322" y="187" font-size="11" text-anchor="middle">Adapter</text>
  <rect x="275" y="200" width="95" height="32" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="322" y="220" font-size="11" text-anchor="middle">PCIe DN</text>
  <text x="322" y="232" font-size="11" text-anchor="middle">Adapter</text>
  <rect x="385" y="250" width="85" height="28" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="427" y="268" font-size="11" text-anchor="middle">USB4 Port</text>
  <rect x="480" y="250" width="85" height="28" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="522" y="268" font-size="11" text-anchor="middle">USB4 Port</text>
  <rect x="580" y="145" width="70" height="32" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="615" y="164" font-size="10" text-anchor="middle">USB3 Gen X</text>
  <text x="615" y="176" font-size="10" text-anchor="middle">DN Adapter</text>
  <rect x="580" y="190" width="70" height="32" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="615" y="209" font-size="10" text-anchor="middle">USB3 Gen X</text>
  <text x="615" y="221" font-size="10" text-anchor="middle">DN Adapter</text>
  <rect x="60" y="95" width="110" height="35" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="115" y="117" font-size="12" text-anchor="middle">DP Source</text>
  <rect x="50" y="155" width="130" height="35" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="115" y="177" font-size="12" text-anchor="middle">PCIe Controller</text>
  <rect x="680" y="75" width="155" height="50" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="757" y="97" font-size="11" text-anchor="middle">Enhanced</text>
  <text x="757" y="111" font-size="11" text-anchor="middle">SuperSpeed Host</text>
  <rect x="710" y="195" width="105" height="35" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="762" y="217" font-size="12" text-anchor="middle">USB 2.0 Host</text>

  <line x1="170" y1="112" x2="275" y2="126" stroke="#000" stroke-width="1" marker-end="url(#arrXthin)"/>
  <line x1="180" y1="172" x2="275" y2="171" stroke="#000" stroke-width="1" marker-end="url(#arrXthin)"/>
  <line x1="180" y1="172" x2="275" y2="216" stroke="#000" stroke-width="1" marker-end="url(#arrXthin)"/>
  <line x1="762" y1="230" x2="762" y2="290" stroke="#000" stroke-width="1"/>
  <line x1="762" y1="290" x2="522" y2="290" stroke="#000" stroke-width="1"/>
  <line x1="522" y1="290" x2="522" y2="278" stroke="#000" stroke-width="1" marker-end="url(#arrXthin)"/>

  <path class="seg arrowed" data-seg="0" d="M 720 100 L 680 100 L 680 161 L 650 161" stroke="#000" stroke-width="3" fill="none"/>
  <path class="seg arrowed" data-seg="1" d="M 615 177 L 615 240 L 522 240 L 522 250" stroke="#000" stroke-width="3" fill="none"/>

  <ellipse cx="427" cy="310" rx="35" ry="14" fill="#b0b0b0" stroke="#000" stroke-width="1"/>
  <ellipse class="seg" data-seg="2" cx="522" cy="310" rx="35" ry="14" fill="#b0b0b0" stroke="#000" stroke-width="1"/>
  <line x1="427" y1="278" x2="427" y2="296" stroke="#000" stroke-width="1"/>
  <line class="seg" data-seg="2" x1="522" y1="278" x2="522" y2="296" stroke="#000" stroke-width="3"/>
  <line x1="427" y1="324" x2="427" y2="345" stroke="#000" stroke-width="1"/>
  <line class="seg" data-seg="2" x1="522" y1="324" x2="522" y2="345" stroke="#000" stroke-width="3"/>

  <rect x="20" y="330" width="840" height="290" fill="none" stroke="#000" stroke-width="1.5"/>
  <text x="45" y="355" font-size="16" font-weight="bold">USB4 Hub</text>
  <rect x="260" y="360" width="400" height="245" fill="#c8c8c8" stroke="#000" stroke-width="1"/>
  <text x="430" y="480" font-size="15" font-weight="bold" text-anchor="middle">Device Router</text>
  <rect x="275" y="375" width="95" height="32" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="322" y="395" font-size="11" text-anchor="middle">DP OUT</text>
  <text x="322" y="407" font-size="11" text-anchor="middle">Adapter</text>
  <rect x="275" y="420" width="95" height="32" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="322" y="440" font-size="11" text-anchor="middle">PCIe UP</text>
  <text x="322" y="452" font-size="11" text-anchor="middle">Adapter</text>
  <rect x="275" y="465" width="95" height="32" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="322" y="485" font-size="11" text-anchor="middle">PCIe DN</text>
  <text x="322" y="497" font-size="11" text-anchor="middle">Adapter</text>
  <rect x="275" y="510" width="95" height="32" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="322" y="530" font-size="11" text-anchor="middle">PCIe DN</text>
  <text x="322" y="542" font-size="11" text-anchor="middle">Adapter</text>
  <rect x="385" y="375" width="85" height="28" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="427" y="393" font-size="11" text-anchor="middle">USB4 Port</text>
  <rect x="385" y="570" width="85" height="28" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="427" y="588" font-size="11" text-anchor="middle">USB4 Port</text>
  <rect x="480" y="570" width="85" height="28" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="522" y="588" font-size="11" text-anchor="middle">USB4 Port</text>
  <rect x="580" y="410" width="70" height="32" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="615" y="429" font-size="10" text-anchor="middle">USB3 Gen X</text>
  <text x="615" y="441" font-size="10" text-anchor="middle">UP Adapter</text>
  <rect x="580" y="500" width="70" height="32" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="615" y="519" font-size="10" text-anchor="middle">USB3 Gen X</text>
  <text x="615" y="531" font-size="10" text-anchor="middle">DN Adapter</text>
  <rect x="580" y="545" width="70" height="32" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="615" y="564" font-size="10" text-anchor="middle">USB3 Gen X</text>
  <text x="615" y="576" font-size="10" text-anchor="middle">DN Adapter</text>
  <rect x="60" y="455" width="115" height="40" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="117" y="479" font-size="12" text-anchor="middle">PCIe Switch</text>
  <rect x="680" y="430" width="155" height="50" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="757" y="452" font-size="11" text-anchor="middle">Enhanced</text>
  <text x="757" y="466" font-size="11" text-anchor="middle">SuperSpeed Hub</text>
  <rect x="710" y="370" width="105" height="35" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="762" y="392" font-size="12" text-anchor="middle">USB 2.0 Hub</text>

  <line x1="175" y1="465" x2="275" y2="436" stroke="#000" stroke-width="1" marker-end="url(#arrXthin)"/>
  <line x1="175" y1="475" x2="275" y2="481" stroke="#000" stroke-width="1" marker-end="url(#arrXthin)"/>
  <line x1="175" y1="485" x2="275" y2="526" stroke="#000" stroke-width="1" marker-end="url(#arrXthin)"/>
  <line x1="762" y1="405" x2="762" y2="345" stroke="#000" stroke-width="1"/>
  <line x1="762" y1="345" x2="427" y2="345" stroke="#000" stroke-width="1"/>
  <line x1="427" y1="345" x2="427" y2="375" stroke="#000" stroke-width="1" marker-end="url(#arrXthin)"/>
  <line x1="762" y1="480" x2="762" y2="600" stroke="#000" stroke-width="1"/>
  <line x1="762" y1="600" x2="522" y2="600" stroke="#000" stroke-width="1"/>
  <line x1="522" y1="600" x2="522" y2="598" stroke="#000" stroke-width="1" marker-end="url(#arrXthin)"/>

  <path class="seg arrowed" data-seg="3" d="M 522 345 L 522 375 L 522 410 L 580 426" stroke="#000" stroke-width="3" fill="none"/>
  <path class="seg arrowed" data-seg="4" d="M 650 426 L 680 426 L 680 455" stroke="#000" stroke-width="3" fill="none"/>
  <path class="seg arrowed" data-seg="5" d="M 757 480 L 757 516 L 650 516" stroke="#000" stroke-width="3" fill="none"/>
  <path class="seg arrowed" data-seg="6" d="M 615 532 L 615 560 L 522 560 L 522 570" stroke="#000" stroke-width="3" fill="none"/>

  <ellipse cx="427" cy="640" rx="35" ry="14" fill="#b0b0b0" stroke="#000" stroke-width="1"/>
  <ellipse class="seg" data-seg="7" cx="522" cy="640" rx="35" ry="14" fill="#b0b0b0" stroke="#000" stroke-width="1"/>
  <line x1="427" y1="598" x2="427" y2="626" stroke="#000" stroke-width="1"/>
  <line class="seg" data-seg="7" x1="522" y1="598" x2="522" y2="626" stroke="#000" stroke-width="3"/>
  <line x1="427" y1="654" x2="427" y2="675" stroke="#000" stroke-width="1"/>
  <line class="seg" data-seg="7" x1="522" y1="654" x2="522" y2="675" stroke="#000" stroke-width="3"/>

  <rect x="20" y="660" width="840" height="290" fill="none" stroke="#000" stroke-width="1.5"/>
  <text x="45" y="685" font-size="16" font-weight="bold">USB4 Device</text>
  <rect x="260" y="690" width="400" height="240" fill="#c8c8c8" stroke="#000" stroke-width="1"/>
  <text x="430" y="810" font-size="15" font-weight="bold" text-anchor="middle">Device Router</text>
  <rect x="275" y="710" width="95" height="32" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="322" y="730" font-size="11" text-anchor="middle">PCIe UP</text>
  <text x="322" y="742" font-size="11" text-anchor="middle">Adapter</text>
  <rect x="275" y="790" width="95" height="32" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="322" y="810" font-size="11" text-anchor="middle">DP OUT</text>
  <text x="322" y="822" font-size="11" text-anchor="middle">Adapter</text>
  <rect x="385" y="710" width="85" height="28" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="427" y="728" font-size="11" text-anchor="middle">USB4 Port</text>
  <rect x="580" y="750" width="70" height="32" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="615" y="769" font-size="10" text-anchor="middle">USB3 Gen X</text>
  <text x="615" y="781" font-size="10" text-anchor="middle">UP Adapter</text>
  <rect x="60" y="725" width="115" height="35" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="117" y="747" font-size="12" text-anchor="middle">PCIe Function</text>
  <rect x="70" y="805" width="95" height="35" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="117" y="827" font-size="12" text-anchor="middle">DP Sink</text>
  <rect x="680" y="775" width="155" height="55" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="757" y="797" font-size="11" text-anchor="middle">Enhanced</text>
  <text x="757" y="811" font-size="11" text-anchor="middle">SuperSpeed Function</text>
  <rect x="710" y="710" width="105" height="35" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="762" y="732" font-size="12" text-anchor="middle">USB 2.0 Function</text>

  <line x1="175" y1="742" x2="275" y2="726" stroke="#000" stroke-width="1" marker-end="url(#arrXthin)"/>
  <line x1="165" y1="822" x2="275" y2="806" stroke="#000" stroke-width="1" marker-end="url(#arrXthin)"/>
  <line x1="762" y1="745" x2="762" y2="675" stroke="#000" stroke-width="1"/>
  <line x1="762" y1="675" x2="427" y2="675" stroke="#000" stroke-width="1"/>
  <line x1="427" y1="675" x2="427" y2="710" stroke="#000" stroke-width="1" marker-end="url(#arrXthin)"/>

  <path class="seg arrowed" data-seg="7" d="M 522 654 L 522 675 L 427 675 L 427 710" stroke="#000" stroke-width="3" fill="none"/>
  <path class="seg arrowed" data-seg="8" d="M 470 724 L 580 724 L 580 766 L 615 766" stroke="#000" stroke-width="3" fill="none"/>
  <path class="seg arrowed" data-seg="9" d="M 650 766 L 680 766 L 680 800" stroke="#000" stroke-width="3" fill="none"/>

  <text x="695" y="420" font-size="10" fill="#333" font-style="italic">Gen X 在 Hub</text>
  <text x="695" y="434" font-size="10" fill="#333" font-style="italic">内终止+交换</text>
`;

export const figures = {
  gent: {
    id: 'gent',
    title: 'Figure 2-24 · USB3 Gen T Tunneling（端到端）',
    body: GT_SVG,
    steps: [
      { hop: 'SS Host · Gen T DFP → Gen T DN Adapter', note: '原生 Gen T 构造进入 Adapter（无 LFPS / Ordered Set）', chips: [['TP','violet'],['DP','violet'],['EPF/END','blue']] },
      { hop: 'Gen T DN Adapter → Host USB4 Port', note: '转换为 Gen T tunneled packet', chips: [['TL HDR','cyan'],['HopID','cyan'],['Gen T','violet']] },
      { hop: 'Host ⇢ Hub · USB4 Link', note: 'USB4 电气链路承载', chips: [['Lane 0','green'],['Lane 1','green']] },
      { hop: 'Hub Router · 直通转发', note: '按 USB4 route 直接 UP→DN，不进任何 USB3 Adapter', chips: [['Route Lookup','cyan'],['HopID→HopID','cyan']] },
      { hop: 'Hub ⇢ Device · USB4 Link', note: '同一条 tunnel 继续', chips: [['Lane 0','green'],['Lane 1','green']] },
      { hop: 'Device Port → Gen T UP Adapter', note: '解封装为原生 Gen T', chips: [['TL HDR','cyan'],['Gen T','violet']] },
      { hop: 'UP Adapter → SS Peripheral · Gen T UFP', note: '端到端到达 endpoint', chips: [['TP','violet'],['DP','violet'],['UFP','amber']] },
    ],
  },
  genx: {
    id: 'genx',
    title: 'Figure 2-19 · USB3 Gen X Tunneling（逐跳）',
    body: GX_SVG,
    steps: [
      { hop: 'SS Host → Gen X DN Adapter', note: '完整 USB3 构造：LFPS · Ordered Set · Link Cmd', chips: [['LFPS','violet'],['TS1/TS2','violet'],['TP/DP','violet']] },
      { hop: 'Gen X DN Adapter → Host USB4 Port', note: '封装为 tunneled packet', chips: [['TL HDR','cyan'],['HopID','cyan'],['Gen X','violet']] },
      { hop: 'Host ⇢ Hub · USB4 Link', note: 'USB4 电气链路承载', chips: [['Lane 0','green'],['Lane 1','green']] },
      { hop: 'Hub USB4 Port → Gen X UP Adapter', note: 'tunnel 在 Hub 内终止！', chips: [['UP Adapter','amber'],['解封装','amber']] },
      { hop: 'UP Adapter → Enhanced SS Hub', note: '还原原生 USB3，Hub 执行传统交换', chips: [['SS Hub','violet'],['Hub 路由','violet']] },
      { hop: 'SS Hub → Gen X DN Adapter', note: '选下行端口，重新发起 tunnel', chips: [['DN Adapter','amber'],['再封装','amber']] },
      { hop: 'DN Adapter → Hub 底部 USB4 Port', note: '新的 tunnel 段', chips: [['HopID','cyan'],['Gen X','violet']] },
      { hop: 'Hub ⇢ Device · USB4 Link', note: '第二段 tunnel 传输', chips: [['Lane 0','green'],['Lane 1','green']] },
      { hop: 'Device Port → Gen X UP Adapter', note: '解封装', chips: [['TL HDR','cyan'],['Gen X','violet']] },
      { hop: 'UP Adapter → SS Function', note: '到达 Function', chips: [['TP','violet'],['DP','violet']] },
    ],
  },
};

export const compareRows = [
  ['隧道模型', '端到端（Endpoint-to-Endpoint）', '逐跳（Hop-by-Hop）终止重建'],
  ['Hub 内行为', '无 Gen T Adapter · 直接穿透 Router', 'UP + DN Adapter · 经 SS Hub 交换'],
  ['Hub 复杂度', '低（不需 USB3 Hub 功能）', '高（必须实现 SS Hub）'],
  ['延迟开销', '低（纯路由转发）', '较高（每跳 USB3 层处理）'],
];