import math

def finger_state(lms,label):
    def is_open(tip,pip):
        return 1 if lms[tip].y < lms[pip].y else 0
    
    index_finger = is_open(8,6)
    middle_finger = is_open(12,10)
    ring_finger = is_open(16,14)
    pinky_finger = is_open(20,18)

    if label == "Right":
        thumb = 1 if lms[4].x < lms[3].x else 0
    else: 
        thumb = 1 if lms[4].x > lms[3].x else 0

    return [thumb,index_finger,middle_finger,ring_finger,pinky_finger]

def is_pinch(lms):
    dx = lms[4].x - lms[8].x
    dy = lms[4].y - lms[8].y
    return math.hypot(dx, dy)

def detect_state(lms,label):
    state = finger_state(lms,label)

    if state == [0,0,0,0,0]:
        return "fist"
    if state == [1,1,1,1,1]:
        return "palm"
    if state == [0,1,0,0,0]:
        return "point"
    if is_pinch(lms) < 0.1:
        return "pinch"
    return "unknown"