import {
  Document, HeadingLevel, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType,
} from 'docx';

const activities = [
  { page: 3, fields: [['poll-2-experience', '다른 경험 한 줄']] },
  { page: 4, fields: [['poll-3-experience', '다른 경험 한 줄']] },
  { page: 6, fields: [['q6text', '기숙사 생활과 교복은 어떤 모습일까요?']] },
  { page: 9, fields: [['eyeAnswer', '눈 보호 체조를 체험한 뒤 어떤 느낌이 들었나요?']] },
  { page: 10, schedule: 'chinaSchedule', fields: [['chinaSource', '찾은 자료의 학교명 또는 링크']] },
  { page: 11, fields: [['d10a', '나의 경험 / 한국'], ['d10b', '중국 자료'], ['d10c', '공통점'], ['d10d', '차이점과 배경']] },
  { page: 12, fields: [['d11a', '나의 경험 / 한국'], ['d11b', '중국 자료'], ['d11c', '공통점'], ['d11d', '차이점과 배경']] },
  { page: 13, schedule: 'oursSchedule', fields: [['oursThought', '우리 학교의 하루를 소개한다면 어떤 순서와 활동을 넣고 싶나요?']] },
  { page: 14, fields: [['respectAnswer', '중국 학생과 학교생활에 관한 생각이 다를 때, 상대방을 존중하면서도 자신의 생각을 솔직하게 전달하려면 어떻게 말해야 할까요?']] },
  { page: 15, fields: [['summaryAnswer', '오늘 살펴본 중국 학교생활 중 나의 생각을 다시 돌아보게 한 내용은 무엇인가요?']] },
];

const invalidXml = /[^\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD\u{10000}-\u{10FFFF}]/gu;
const clean = text => text.replace(invalidXml, '');

export function collectWrittenResults(state, slides) {
  return activities.flatMap(({ page, fields, schedule }) => {
    const answers = fields.flatMap(([id, question]) => {
      const text = clean(state.fields[id] ?? '');
      return text.trim() ? [{ question, text }] : [];
    });
    const rows = schedule ? state.tables[schedule].flatMap(({ time, activity }, index) => {
      const when = clean(time);
      const what = clean(activity);
      return when.trim() || what.trim() ? [[String(index + 1), when, what]] : [];
    }) : [];

    if (!answers.length && !rows.length) return [];
    return [{ title: slides[page - 1].attrs['data-title'], answers, rows }];
  });
}

const font = { ascii: 'Malgun Gothic', hAnsi: 'Malgun Gothic', eastAsia: 'Malgun Gothic' };

function textLines(text) {
  return text.split(/\r\n|\r|\n/).map(line => new Paragraph({
    children: [new TextRun({ text: line })],
  }));
}

function scheduleTable(rows) {
  const widths = [12, 23, 65];
  const makeRow = (values, header = false) => new TableRow({
    tableHeader: header,
    children: values.map((text, index) => new TableCell({
      width: { size: widths[index], type: WidthType.PERCENTAGE },
      children: header ? [new Paragraph({
        children: [new TextRun({ text, bold: true })],
        spacing: { before: 80, after: 80 },
      })] : textLines(text),
    })),
  });
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [makeRow(['순서', '시간', '활동'], true), ...rows.map(row => makeRow(row))],
  });
}

export function makeWordResults(state, slides) {
  const title = '중국의 학교생활 학습 결과';
  const sections = collectWrittenResults(state, slides);
  const children = [new Paragraph({ text: title, heading: HeadingLevel.TITLE })];

  for (const { title, rows, answers } of sections) {
    children.push(new Paragraph({ text: title, heading: HeadingLevel.HEADING_1, keepNext: true }));
    if (rows.length) children.push(scheduleTable(rows));
    for (const { question, text } of answers) {
      children.push(new Paragraph({
        children: [new TextRun({ text: question, bold: true })],
        spacing: { before: 170, after: 70 },
        keepNext: true,
      }), ...textLines(text));
    }
  }

  if (!sections.length) children.push(new Paragraph('작성한 답변이 없습니다.'));
  const document = new Document({
    title,
    styles: {
      default: {
        document: { run: { font, size: 22, color: '000000' }, paragraph: { spacing: { after: 90, line: 300 } } },
        title: { run: { font, size: 42, color: '000000', bold: true }, paragraph: { spacing: { after: 320 } } },
        heading1: { run: { font, size: 29, color: '000000', bold: true }, paragraph: { spacing: { before: 260, after: 100 } } },
      },
    },
    sections: [{ children }],
  });
  return Packer.toBlob(document);
}
