from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
import pandas as pd

df = pd.read_csv('datos_sinteticos.csv')
df = df.dropna()
X = df.drop(columns=['precio'])
y = df['precio']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

clf = LogisticRegression(C=1, max_iter=1000).fit(X_train, y_train)

pickle.dump(clf, open('modelo.pkl', 'wb'))

print(clf.predict([[6, 111, 4, 3,1]]))
print(f'score: {clf.score(X_test, y_test)}')