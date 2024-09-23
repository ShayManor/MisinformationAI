import json

from openai import OpenAI

class answer:
   def __init__(self, isCorrect, summary):
       self.isCorrect = isCorrect
       self.summary = summary

   def to_dict(self):
        return {
            "isCorrect": self.isCorrect,
            "submissionText": self.summary,
        }

def format_data(data):
    try:
        correct, summary = data.split('@')
    except:
        raise Exception('Invalid data format')
    res = answer(True, summary).to_dict()
    # res = answer(correct.upper() == 'YES', summary).to_dict()
    return res


class detector:
    def __init__(self):
        self.client = OpenAI()
        self.client.api_key = ApiKey
        self.assistant_id = 'asst_w9q2mR176ddHJiK0wLWczBRw'

    def detect_misinformation(self, user_input):
        assistant = self.client.beta.assistants.retrieve(
            assistant_id=self.assistant_id
        )

        thread = self.client.beta.threads.create(
            messages=[{"role": "user", "content": user_input}]
        )
        run = self.client.beta.threads.runs.create_and_poll(
            thread_id=thread.id,
            assistant_id=assistant.id,
        )

        if run.status == "completed":
            messages = self.client.beta.threads.messages.list(thread_id=run.thread_id)
            ai_response = messages.data[0].content[0].text.value
            return ai_response

    def run(self, user_input):
        data = self.detect_misinformation(str(user_input))
        return format_data(data)