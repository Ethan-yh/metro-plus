import numpy
from tensorflow.keras.models import load_model
import pickle
import json

model = load_model('./data_process/DATA/Test.h5')

scaler = pickle.load(open('./data_process/DATA/scaler.pkl', 'rb'))


with open("./data/param.json", 'r', encoding="utf-8")as f:
    param = json.load(f)



def getPreX(arr):
    dataset = []
    for i in arr:
        dataset.append([i])

    dataset = numpy.array(dataset)

    dataset = dataset.astype('float32')
    dataset = scaler.transform(dataset)
    preX = numpy.array([dataset])

    return preX

def getPreY(preX):
    preY = model.predict(preX)
    preY = int(scaler.inverse_transform(preY)[0][0])
    
    return preY

arr = param['preX']
preX = getPreX(arr)
preY = getPreY(preX)
print(preY)

arr2 = [param['preX'][1], preY]
preX2 = getPreX(arr2)
preY2 = getPreY(preX2)
print(preY2)

result = {}
result['preY'] = [preY, preY2]

with open('./data/result.json', 'w', encoding='utf-8')as f:
    json.dump(result, f, indent=1, ensure_ascii=False)




