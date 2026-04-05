import { formatFullNumber, calcPercentage, getPartyColor } from '../../utils/helpers';

const RANK_COLORS = ['#f59e0b','#9ca3af','#b45309'];

export default function ResultCard({ candidate, totalVotes, rank = 0 }) {
  const pct   = calcPercentage(candidate.votes, totalVotes);
  const color = getPartyColor(candidate.party);
  const isWinner = rank === 0;
  return (
    <div className={`result-card${isWinner?' winner':''}`}>
      <div className="result-card-header">
        <div className="result-card-avatar" style={isWinner?{border:'2px solid var(--inec-green)'}:{}}>
          {candidate.avatar || candidate.candidate?.[0] || '🗳️'}
        </div>
        <div style={{flex:1}}>
          <div className="result-card-name">{candidate.candidate}</div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginTop:4}}>
            <span className="badge" style={{background:color+'22',color}}>{candidate.party}</span>
            {isWinner && <span className="winner-crown">👑 Leading</span>}
          </div>
        </div>
        {rank < 3 && (
          <div style={{width:28,height:28,borderRadius:'50%',background:RANK_COLORS[rank],
                       display:'flex',alignItems:'center',justifyContent:'center',
                       color:'#fff',fontWeight:800,fontSize:'0.8rem',flexShrink:0}}>
            {rank+1}
          </div>
        )}
      </div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:8}}>
        <span className="result-card-votes">{formatFullNumber(candidate.votes)}</span>
        <span className="result-card-pct">{pct}%</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{width:`${pct}%`,background:color}} />
      </div>
    </div>
  );
}