export function toLocalDate(date: number | Date): string {
  const localDate = new Date(date);
  return `${localDate.toISOString()
    .slice(0, 10)} ${localDate.toLocaleTimeString('ja-jp', {timeZoneName: 'short'})}`;
}

export function replaceAll(target: string, searchValue: string, replaceValue: string): string {
  const reg = new RegExp(searchValue, 'g');
  return target.replace(reg, replaceValue);
}

export function getJobName(text: string): string {
  const messageBreakdown = replaceAll(text, '&nbsp;', ' ')
    .split(' ');
  const index = messageBreakdown.findIndex(e => e === 'build');
  if (index < 0) {
    return null;
  }
  return replaceAll(messageBreakdown[messageBreakdown.findIndex(e => e === 'build') + 1]
                  , '\n', '');
}
