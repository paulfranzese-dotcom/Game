export const NumberPad = ({ onInput, onSubmit }: { onInput: (v: string) => void; onSubmit: () => void }) => (
  <div className="pad">
    {[1,2,3,4,5,6,7,8,9,0].map((n)=> <button key={n} onClick={()=>onInput(String(n))}>{n}</button>)}
    <button onClick={() => onInput('clear')}>Clear</button>
    <button onClick={onSubmit}>Enter</button>
  </div>
);
