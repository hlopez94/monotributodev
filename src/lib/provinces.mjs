export function provincePresentation(guide,regime='unknown',activity='export'){
 const monthlyMode=regime==='cm'?'cm':!guide?'missing':regime==='general'?'general':'confirm';
 return {monthlyMode,monthlySteps:monthlyMode==='general'?guide.monthly.steps:[],mixed:activity==='mixed'};
}
