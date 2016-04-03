print(__doc__)
import urllib
from sklearn import svm
import pickle
from PIL import Image
import numpy as np
from os import listdir
from os.path import isfile, join
from sklearn import svm, metrics
import numpy as np
import os
import argparse
from sklearn.metrics import accuracy_score


###############################################################
parser = argparse.ArgumentParser(description='Perform Skin Image Classification using SVMs')
parser.add_argument('--IMAGE_PATH', help='Path to the images')
parser.add_argument('--MODEL_PATH', help='Path to the Svm_model')
args = parser.parse_args()

###############################################################
def Test_Image_TO_Matrix(image_folder_path, label_is= 0):
    ### Transfer image files to be matrix shaped as (1, 640*480).
    onlyfiles = [f for f in listdir(image_folder_path) if isfile(join(image_folder_path, f)) and not f.startswith('.')]
    print
    print "Image Files are: ", onlyfiles
    print
    for i in range(0, len(onlyfiles)):

        url = join(image_folder_path, onlyfiles[i])
        im = Image.open(url).convert("L")  # Convert image to monochrome
        im2 =im.resize((640, 480))
        # im2.show()
        IM = np.array(im2)
        IM = IM.reshape((1, 307200))

        labels = label_is

        IM = np.hstack((IM, np.array(labels).reshape((1,1))))
        if i == 0:
          Final_Matrix = IM
        else:
          Final_Matrix = np.vstack((Final_Matrix, IM))

    # print 'Shape of the Test Images Matrix:', Final_Matrix.shape
    txt_file = np.savetxt('./images_test.txt', Final_Matrix, delimiter=',', fmt='%d')
    file_place = os.path.abspath('./images_test.txt')
    return file_place


###############################################################
def create_dataset(url, i=0, j=307200, m=307200):
    ### Preparing test dataset.
    raw_data = urllib.urlopen(url)
    dataset = np.loadtxt(raw_data, delimiter=",")
    if len(dataset.shape) == 1:
        dataset = dataset.reshape((1,dataset.shape[0]))
    else: pass
    # print "Dataset.shape:", (dataset.shape)

    ### Separate the data from the target attributes
    data = dataset[:,i:j]
    target = dataset[:,m]
    target = target.astype(np.int32)
    myDict = {}
    myDict['data']= data
    myDict['target']= target
    return myDict

def Shuffle_Data(n_samples):
    shuffleIdx = range(n_samples)
    np.random.shuffle(shuffleIdx)
    return shuffleIdx

###############################################################
### Train and save the SVM model:
def train_and_save_svm():
    ### Return the ready-for-use SVM model.
    train_images = create_dataset('/Users/yywxenia/Desktop/images_matrix.txt', 0, 307200, 307200)
    n_samples = len(train_images['target'])
    print "Number of samples: ", n_samples
    n_samples = len(train_images['target'])
    idx = Shuffle_Data(n_samples)
    X = train_images['data'][idx]
    y = train_images['target'][idx]

    accuracy=[]
    clf = svm.SVC(kernel='linear', gamma=0.05, probability=True)
    clf.fit(X, y)

    TRAINED_SVM_MODEL = '/Users/yywxenia/Desktop/SVM_model.yyw'   # Saved the SVM model
    with open(TRAINED_SVM_MODEL, 'w') as f:
        print "Saving file >>>>>>"
        TRAINED_SVM = pickle.dump(clf, f)
        print "Saved!"

    return TRAINED_SVM


###############################################################
def predict_image(test_file_path, label_is=0):
    ### Main function for testing images:
    SVMmodel = os.path.abspath(args.MODEL_PATH)
    with open(SVMmodel , 'r') as f:
        print "loading SVM model >>>>>>"
        clf2 = pickle.load(f)
        print "SVM Loaded!"

    test_file = Test_Image_TO_Matrix(test_file_path, label_is)
    test_image = create_dataset(url=test_file, i=0, j=307200, m=307200)
    Xtest = test_image['data']

    predicted = clf2.predict(Xtest)
    prob = clf2.predict_proba(Xtest)

    for i in range(Xtest.shape[0]):
        print '=============Result Summary for Case'+str(i)+'==============='
        print "Below is your diagnosis result:  "
        if predicted[i] ==1:
            print "Your Skin Condition Might Be 'Measles'"
        elif predicted[i] ==2:
            print "Your Skin Condition Might Be 'Shingles'"
        elif predicted[i]==3:
            print "Your Skin Condition Might Be 'Ringworm' "
        elif predicted[i]==4:
            print "Your Skin Condition Might Be 'Chicken Pox' "
        print
    print '-------------------------------------------------------------'
    print "Posterior probability (confidence) for being 'Measles', 'Shingles', 'Ringworm', 'Chicken Pox' : "
    print prob
    print

    return predicted, prob


###############################################################
image_path = os.path.abspath(args.IMAGE_PATH)
print ">>> Image path: ", image_path
predict_image(image_path, label_is=0)  
# label_is=0 means no initial label provided, which is used for all testing data.


