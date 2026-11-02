export default function StudyReview({ guide }) {
  return <>
    <section id="exam-preparation" className="scroll-mt-24"><h2>Exam preparation</h2><h3>Definition for a short answer</h3><blockquote><p>{guide.definition}</p></blockquote><h3>Explain the topic: model answer</h3><p><strong>{guide.examQuestion}</strong></p><ol>{guide.examAnswer.map((answer,index) => <li key={index}>{answer}</li>)}</ol><p className="text-base">Support the explanation with the worked example above. For a longer answer, show the input, query, result, and reason for that result. These are practice model answers, not predictions of a particular examination paper or marking scheme.</p></section>
    <section id="interview-preparation" className="scroll-mt-24"><h2>Interview preparation</h2><h3>{guide.interviewQuestion}</h3><p>{guide.interviewAnswer}</p><h3>Follow-up: {guide.followUp}</h3><p>{guide.followUpAnswer}</p><p className="text-base">Answer aloud before reading the model response. State the relevant assumption and explain the behavior using a concrete example.</p></section>
  </>
}
