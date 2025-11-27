export default function calculateElectronConfig(atomicNumber) {
  // 오비탈 채우기 순서 (오프바우 원리)
  const orbitals = [
    { shell: 1, subshell: 's', max: 2 },   // 1s
    { shell: 2, subshell: 's', max: 2 },   // 2s
    { shell: 2, subshell: 'p', max: 6 },   // 2p
    { shell: 3, subshell: 's', max: 2 },   // 3s
    { shell: 3, subshell: 'p', max: 6 },   // 3p
    { shell: 4, subshell: 's', max: 2 },   // 4s
    { shell: 3, subshell: 'd', max: 10 },  // 3d
    { shell: 4, subshell: 'p', max: 6 },   // 4p
    { shell: 5, subshell: 's', max: 2 },   // 5s
    { shell: 4, subshell: 'd', max: 10 },  // 4d
    { shell: 5, subshell: 'p', max: 6 },   // 5p
    { shell: 6, subshell: 's', max: 2 },   // 6s
    { shell: 4, subshell: 'f', max: 14 },  // 4f
    { shell: 5, subshell: 'd', max: 10 },  // 5d
    { shell: 6, subshell: 'p', max: 6 },   // 6p
    { shell: 7, subshell: 's', max: 2 },   // 7s
    { shell: 5, subshell: 'f', max: 14 },  // 5f
    { shell: 6, subshell: 'd', max: 10 },  // 6d
    { shell: 7, subshell: 'p', max: 6 },   // 7p
  ];

  let remaining = atomicNumber;
  const shellCount = new Array(7).fill(0);

  // 오비탈 순서대로 전자 배치
  for (const orbital of orbitals) {
    if (remaining <= 0) break;
    
    const electrons = Math.min(remaining, orbital.max);
    shellCount[orbital.shell - 1] += electrons;
    remaining -= electrons;
  }

  // 0이 아닌 껍질만 반환
  return shellCount.filter((count, index) => {
    // 해당 껍질까지 전자가 있는지 확인
    return shellCount.slice(0, index + 1).some(c => c > 0) && count > 0;
  });
}