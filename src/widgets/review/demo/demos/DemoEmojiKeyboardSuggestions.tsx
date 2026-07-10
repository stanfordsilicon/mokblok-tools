import { useDataContext } from '@data/DataContext';

const STANDARD_KEYS = [
  ...['q', 'w', 'e', 'r', 't', 'y', 'u', 'i'],
  ...['a', 's', 'd', 'f', 'g', 'h', 'j', 'k'],
];

const DemoEmojiKeyboardSuggestions: React.FC<{ includeAnnotations: boolean }> = ({
  includeAnnotations,
}) => {
  const { findDataEntry, getTranslation, alphabet } = useDataContext();
  const heartSuit = findDataEntry({ instance: '♥️' });
  const heartRed = findDataEntry({ instance: '❤️' });
  const heartFace = findDataEntry({ instance: '🥰' });

  // Find the common word in all translations to find probably the word for heart
  const heartWords = [
    getTranslation(heartFace)?.split(/\s/) ?? [],
    getTranslation(heartRed)?.split(/\s/) ?? [],
    getTranslation(heartSuit)?.split(/\s/) ?? [],
  ];
  const wordsCounted = heartWords.flat().reduce(
    (acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  const mostCommonWordCount = Object.entries(wordsCounted).sort((a, b) => b[1] - a[1])[0];
  const heartWord =
    !mostCommonWordCount || mostCommonWordCount[1] === 1 ? 'heart' : mostCommonWordCount[0];

  // Fake keyboard keys
  const characterHistogram = alphabet?.characterHistogram ?? {};
  const keys =
    Object.entries(characterHistogram || {})
      .sort(([, countA], [, countB]) => countB - countA)
      .map(([char]) => char) ?? STANDARD_KEYS;

  return (
    <>
      <g id="message1">
        <rect x={130} y={10} width={100} height={40} fill="#ddf" stroke="#ccc" rx={15} ry={15} />
        <text x={220} y={35} style={{ textAnchor: 'end' }}>
          ☀️🌡️! 😀
        </text>
        <text x={220} y={65} style={{ textAnchor: 'end' }}>
          {getTranslation(findDataEntry({ group: 'Times', instance: 'Hm', exampleNum: '1' }))}
        </text>
      </g>
      <g id="message2">
        <rect x={10} y={50} width={100} height={40} fill="#ffd" stroke="#ccc" rx={15} ry={15} />
        <text x={20} y={75}>
          💡! 🐕🏃?
        </text>
        <text x={10} y={105}>
          {getTranslation(findDataEntry({ group: 'Times', instance: 'Hm', exampleNum: '2' }))}
        </text>
      </g>

      <g id="inputBox">
        <rect x={10} y={120} width={180} height={30} fill="#eee" stroke="#ccc" rx={10} ry={10} />
        <text x={20} y={140}>
          ✔️ {heartWord}|
        </text>
        <rect x={200} y={120} width={30} height={30} fill="#eee" stroke="#ccc" rx={15} ry={15} />
        <text x={210} y={140}>
          ▶
        </text>
      </g>

      <g id="suggestions">
        <rect x={0} y={160} width={240} height={30} fill="#f7f7f7" stroke="#ccc" />
        <text x={45} y={180} style={{ textAnchor: 'middle' }}>
          {heartWord}
        </text>
        <line x1={90} y1={160} x2={90} y2={190} stroke="#ccc" />
        <text x={100} y={180}>
          ♥️
        </text>
        <line x1={130} y1={160} x2={130} y2={190} stroke="#ccc" />
        <text x={140} y={180}>
          ❤️
        </text>
        <line x1={170} y1={160} x2={170} y2={190} stroke="#ccc" />
        <text x={180} y={180}>
          🥰
        </text>
        <line x1={210} y1={160} x2={210} y2={190} stroke="#ccc" />
      </g>

      <g id="keyboards" style={{ textAnchor: 'middle' }}>
        <rect x={10} y={195} width={20} height={20} fill="#f7f7f7" rx={5} ry={5} />
        <rect x={35} y={195} width={20} height={20} fill="#f7f7f7" rx={5} ry={5} />
        <rect x={60} y={195} width={20} height={20} fill="#f7f7f7" rx={5} ry={5} />
        <rect x={85} y={195} width={20} height={20} fill="#f7f7f7" rx={5} ry={5} />
        <rect x={110} y={195} width={20} height={20} fill="#f7f7f7" rx={5} ry={5} />
        <rect x={135} y={195} width={20} height={20} fill="#f7f7f7" rx={5} ry={5} />
        <rect x={160} y={195} width={20} height={20} fill="#f7f7f7" rx={5} ry={5} />
        <rect x={185} y={195} width={20} height={20} fill="#f7f7f7" rx={5} ry={5} />
        <rect x={210} y={195} width={20} height={20} fill="#f7f7f7" rx={5} ry={5} />
        <text x={20} y={210}>
          {keys[0]}
        </text>
        <text x={45} y={210}>
          {keys[1]}
        </text>
        <text x={70} y={210}>
          {keys[2]}
        </text>
        <text x={95} y={210}>
          {keys[3]}
        </text>
        <text x={120} y={210}>
          {keys[4]}
        </text>
        <text x={145} y={210}>
          {keys[5]}
        </text>
        <text x={170} y={210}>
          {keys[6]}
        </text>
        <text x={195} y={210}>
          {keys[7]}
        </text>
        <text x={220} y={210}>
          {keys[8]}
        </text>
        <rect x={15} y={220} width={20} height={20} fill="#f7f7f7" rx={5} ry={5} />
        <rect x={40} y={220} width={20} height={20} fill="#f7f7f7" rx={5} ry={5} />
        <rect x={65} y={220} width={20} height={20} fill="#f7f7f7" rx={5} ry={5} />
        <rect x={90} y={220} width={20} height={20} fill="#f7f7f7" rx={5} ry={5} />
        <rect x={115} y={220} width={20} height={20} fill="#f7f7f7" rx={5} ry={5} />
        <rect x={140} y={220} width={20} height={20} fill="#f7f7f7" rx={5} ry={5} />
        <rect x={165} y={220} width={20} height={20} fill="#f7f7f7" rx={5} ry={5} />
        <rect x={190} y={220} width={20} height={20} fill="#f7f7f7" rx={5} ry={5} />
        <rect x={215} y={220} width={20} height={20} fill="#f7f7f7" rx={5} ry={5} />
        <text x={25} y={235}>
          {keys[9]}
        </text>
        <text x={50} y={235}>
          {keys[10]}
        </text>
        <text x={75} y={235}>
          {keys[11]}
        </text>
        <text x={100} y={235}>
          {keys[12]}
        </text>
        <text x={125} y={235}>
          {keys[13]}
        </text>
        <text x={150} y={235}>
          {keys[14]}
        </text>
        <text x={175} y={235}>
          {keys[15]}
        </text>
        <text x={200} y={235}>
          {keys[16]}
        </text>
        <text x={225} y={235}>
          {keys[17]}
        </text>
      </g>

      {includeAnnotations && (
        <g id="annotations1" transform="translate(220, 50)" style={{ textAnchor: 'end' }}>
          <path d="M-20,0 L-30,-10 L-40,0 Z" fill="#f7f7f7" stroke="#ccc" />
          <rect
            x={-120}
            y={0}
            width={120}
            height={70}
            fill="#f7f7f7"
            stroke="#ccc"
            rx={15}
            ry={15}
          />
          <text x={-10} y={20}>
            {getTranslation(findDataEntry({ instance: '☀️' }))}
          </text>
          <text x={-10} y={40}>
            {getTranslation(findDataEntry({ instance: '🌡️' }))}
          </text>
          <text x={-10} y={60}>
            {getTranslation(findDataEntry({ instance: '😀' }))}
          </text>
        </g>
      )}

      {includeAnnotations && (
        <g id="annotations2" transform="translate(20, 130)" style={{ textAnchor: 'start' }}>
          <path d="M20,0 L30,-50 L40,0 Z" fill="#f7f7f7" stroke="#ccc" />
          <rect
            x={0}
            y={0}
            width={120}
            height={70}
            fill="#f7f7f7"
            stroke="#ccc"
            style={{ boxShadow: '2px 2px 5px rgba(0,0,0)' }}
            rx={15}
            ry={15}
          />
          <text x={10} y={20}>
            {getTranslation(findDataEntry({ instance: '💡' }))}
          </text>
          <text x={10} y={40}>
            {getTranslation(findDataEntry({ instance: '🐕' }))}
          </text>
          <text x={10} y={60}>
            {getTranslation(findDataEntry({ instance: '🏃' }))}
          </text>
        </g>
      )}
    </>
  );
};

export default DemoEmojiKeyboardSuggestions;
