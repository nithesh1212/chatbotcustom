import string

from nltk.corpus import stopwords as sw
from nltk.corpus import wordnet as wn
from nltk import wordpunct_tokenize
from nltk import WordNetLemmatizer
from nltk import sent_tokenize
from nltk import pos_tag

from sklearn.base import BaseEstimator, TransformerMixin


class NLTKPreprocessor(BaseEstimator, TransformerMixin):

    def __init__(self, stopwords=None, punct=None,
                 lower=True, strip=True):
        print("Inside NLTk cosnt")
        self.lower = lower
        self.strip = strip
        self.stopwords  = stopwords or set(sw.words('english'))
        self.punct = punct or set(string.punctuation)
        self.lemmatizer = WordNetLemmatizer()

    def fit(self, X, y=None):
        print("In fit")
        return self

    def inverse_transform(self, X):
        print("In inverse")
        return [" ".join(doc) for doc in X]

    def transform(self, X):
        print("In transorm")
        return [
            list(self.tokenize(doc)) for doc in X
        ]

    def tokenize(self, document):
        # Break the document into sentences
        print("In tokenize")
        for sent in sent_tokenize(document):
            print("sent",sent)
            # Break the sentence into part of speech tagged tokens
            try:
                for token, tag in pos_tag(wordpunct_tokenize(sent)):
                    # Apply preprocessing to the token
                    token = token.lower() if self.lower else token
                    token = token.strip() if self.strip else token
                    token = token.strip('_') if self.strip else token
                    token = token.strip('*') if self.strip else token

                    # If stopword, ignore token and continue
                    # if token in self.stopwords:
                    #     continue

                    # If punctuation, ignore token and continue
                    if all(char in self.punct for char in token):
                        continue

                    # Lemmatize the token and yield
                    lemma = self.lemmatize(token, tag)
                    yield lemma
            except:
                print("In token tag")

    def lemmatize(self, token, tag):
        print("In leammarize")
        tag = {
            'N': wn.NOUN,
            'V': wn.VERB,
            'R': wn.ADV,
            'J': wn.ADJ
        }.get(tag[0], wn.NOUN)

        return self.lemmatizer.lemmatize(token, tag)
