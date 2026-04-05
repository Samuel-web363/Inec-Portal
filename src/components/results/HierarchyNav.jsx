export default function HierarchyNav({ levels, onNavigate }) {
  return (
    <div className="hierarchy-nav">
      {levels.map((lvl, i) => (
        <span key={i} style={{display:'flex',alignItems:'center',gap:6}}>
          {i > 0 && <span className="hierarchy-sep">›</span>}
          <span className={`hierarchy-item${i===levels.length-1?' current':''}`}
                onClick={()=>i<levels.length-1 && onNavigate(i)}>
            {lvl}
          </span>
        </span>
      ))}
    </div>
  );
}