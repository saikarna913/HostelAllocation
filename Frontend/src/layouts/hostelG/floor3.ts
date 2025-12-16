import { AbsoluteFloorLayout } from '@/types/layout';

const floor3: AbsoluteFloorLayout = {
  frame: { width: 1000, height: 600 },
  nodes: [
    { id: 'pantry', type: 'pantry', x: 463, y: 86, width: 51, height: 52, label: 'pantry' },
    { id: 'washroom', type: 'pantry', x: 382, y: 20, width: 133, height: 60, label: 'washroom' },
    { id: 'stairs', type: 'pantry', x: 10, y: 274, width: 164, height: 61, label: 'stairs' },
    { id: 'corridor', type: 'pantry', x: 427, y: 112, width: 248, height: 19, label: 'corridor' },
    { id: 'corridor', type: 'pantry', x: 243, y: 86, width: 212, height: 19, label: 'corridor' },
    { id: 'corridor', type: 'pantry', x: 83, y: 346, width: 332, height: 19, label: 'corridor' },
    { id: '417', type: 'room', x: 308, y: 20, width: 60, height: 60 },
    { id: '415', type: 'room', x: 243, y: 20, width: 60, height: 60 },
    { id: '408', type: 'room', x: 183, y: 274, width: 60, height: 60 },
    { id: '410', type: 'room', x: 83, y: 274, width: 60, height: 60 },
    { id: '404', type: 'room', x: 356, y: 274, width: 60, height: 60 },
    { id: '418', type: 'room', x: 455, y: 182, width: 60, height: 60 },
    { id: '406', type: 'room', x: 248, y: 274, width: 60, height: 60 },
    { id: '411', type: 'room', x: 154, y: 378, width: 60, height: 60 },
    { id: '413', type: 'room', x: 89, y: 378, width: 60, height: 60 },
    { id: '407', type: 'room', x: 284, y: 377, width: 60, height: 60 },
    { id: '405', type: 'room', x: 349, y: 378, width: 60, height: 60 },
    { id: 'Wahroom', type: 'pantry', x: 427, y: 378, width: 88, height: 59, label: 'Wahroom' },
    { id: '409', type: 'room', x: 219, y: 378, width: 60, height: 60 },
    { id: '416', type: 'room', x: 308, y: 110, width: 60, height: 60 },
    { id: 'lift', type: 'pantry', x: 455, y: 146, width: 60, height: 24, label: 'lift' },
    { id: '414', type: 'room', x: 243, y: 110, width: 60, height: 60 },
    { id: 'Wing 2', type: 'label', x: 12, y: 230, width: 93, height: 32, label: 'Wing 2' },
    { id: 'Wing 1', type: 'label', x: 133, y: 80, width: 80, height: 23, label: 'Wing 1' }
  ],
};

export default floor3;
