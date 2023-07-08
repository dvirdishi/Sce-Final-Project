

import numpy as np
import cv2
import base64
import requests
import time

sdThresh = 5
font = cv2.FONT_HERSHEY_SIMPLEX
#TODO: Face Detection 1

def sendtoserver(frame, serverURI : str):
    imencoded = cv2.imencode(".jpg", frame)[1]
    # str = base64.b64encode(imageFile.read())
    file = {'image': ('image.jpg', imencoded.tostring(), 'image/jpeg', {'Expires': '0'})}
    data = {"height" :frame.shape[0], "width" : frame.shape[1]}
    # data = {"height" :frame.shape[0], "width" : frame.shape[1], "file": file}
    print("sending image... ")
    response = requests.post(serverURI, files=file, data=data, timeout=5)
    # time.sleep(5)
    print(response)
    return response


def distMap(frame1, frame2):
    """outputs pythagorean distance between two frames"""
    frame1_32 = np.float32(frame1)
    frame2_32 = np.float32(frame2)
    diff32 = frame1_32 - frame2_32
    norm32 = np.sqrt(diff32[:,:,0]**2 + diff32[:,:,1]**2 + diff32[:,:,2]**2)/np.sqrt(255**2 + 255**2 + 255**2)
    dist = np.uint8(norm32*255)
    return dist

def run(serverAddress : str, serverPort : str, routing : str):

    cap, frame1, frame2, end, start, deltaTime = setUp()
    serverURI = "http://{}:{}/{}/".format(serverAddress, serverPort, routing)
    

    while(True):
        _, frame3 = cap.read()
        rows, cols, _ = np.shape(frame3)
        cv2.imshow('dist', frame3)
        dist = distMap(frame1, frame3)

        frame1 = frame2
        frame2 = frame3

        # apply Gaussian smoothing
        mod = cv2.GaussianBlur(dist, (9,9), 0)

        # apply thresholding
        _, thresh = cv2.threshold(mod, 100, 255, 0)

        # calculate st dev test
        _, stDev = cv2.meanStdDev(mod)

        cv2.imshow('dist', mod)
        # cv2.putText(frame2, "Standard Deviation - {}".format(round(stDev[0][0],0)), (70, 70), font, 1, (255, 0, 255), 1, cv2.LINE_AA)
        if stDev > sdThresh:
                # print("Motion detected.. Do something!!!")
                #TODO: Face Detection 2
                try:
                    if(end - start >= deltaTime):
                        start = time.time()
                        sendtoserver(frame2, serverURI)
                except:
                    pass
                finally:
                    end = time.time()

        cv2.imshow('frame', frame2)
        if cv2.waitKey(1) & 0xFF == 27:
            break

    cap.release()
    cv2.destroyAllWindows()

def setUp():
    cv2.namedWindow('frame')
    cv2.namedWindow('dist')

    #capture video stream from camera source. 0 refers to first camera, 1 referes to 2nd and so on.
    cap = cv2.VideoCapture(0)

    _, frame1 = cap.read()
    _, frame2 = cap.read()

    start = time.time()
    end = time.time()
    deltaTime = 2
    return cap, frame1, frame2, end, start, deltaTime
