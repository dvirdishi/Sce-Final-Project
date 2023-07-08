import dataProducer
import sys

if __name__ == '__main__':
    """
    usage: python3 -m cameraClient {serverIP} {serverPort} {routingInServer} 
    """
    dataProducer.run("localhost","3003","upload")

