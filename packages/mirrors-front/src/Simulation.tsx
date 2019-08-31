import CameraControls from 'camera-controls'
import randomColor from 'randomcolor'
import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

CameraControls.install({ THREE: THREE })

// @ts-ignore
const { ipcRenderer } = window.require('electron')

type Vector2 = [number, number]
type Vector3 = [number, number, number]
interface Detection {
  tag_family: string
  tag_id: number
  hamming: number
  decision_margin: number
  homography: [Vector3, Vector3, Vector3]
  center: Vector2
  corners: [Vector2, Vector2, Vector2, Vector2]
  pose_R: [Vector3, Vector3, Vector3]
  pose_t: [[number], [number], [number]]
  pose_err: number
}

const testDetections: Detection[] = [
  {
    tag_family: 'tag36h11',
    tag_id: 22,
    hamming: 0,
    decision_margin: 53.34062576293945,
    homography: [
      [-6.889511629165381, -13.957340627441114, 290.8420531379719],
      [-4.786983953970719, 0.6308633683574376, 251.75741859204425],
      [-0.03985631376955301, -0.01167655682842769, 1.0],
    ],
    center: [290.8420531379719, 251.75741859204425],
    corners: [
      [275.99670410156244, 250.12675476074224],
      [284.6647949218751, 261.0541687011719],
      [306.54833984375, 253.48265075683588],
      [296.41384887695295, 243.37188720703122],
    ],
    pose_R: [
      [0.50625838, -0.86128212, 0.04353811],
      [0.36505846, 0.25977241, 0.89400817],
      [-0.78130325, -0.43670518, 0.44593028],
    ],
    pose_t: [[-0.14704937], [0.13563819], [1.16745312]],
    pose_err: 1.1575006654120552e-6,
  },
  {
    tag_family: 'tag36h11',
    tag_id: 24,
    hamming: 0,
    decision_margin: 54.2474250793457,
    homography: [
      [-7.216477947427962, 15.012800485778627, 250.21603840597464],
      [-10.913323839364125, 2.550619939921062, 218.02018393163337],
      [-0.01142811698791873, 0.028401109943745333, 1.0],
    ],
    center: [250.21603840597464, 218.02018393163337],
    corners: [
      [262.0096740722657, 222.61744689941412],
      [253.70620727539057, 206.1583557128906],
      [237.44396972656247, 213.04151916503898],
      [246.6053466796875, 230.2916259765625],
    ],
    pose_R: [
      [-0.44766528, 0.67762605, -0.58345414],
      [-0.89278764, -0.37537841, 0.24904071],
      [-0.05025962, 0.63238752, 0.77302005],
    ],
    pose_t: [[-0.35144355], [0.02199876], [1.42138823]],
    pose_err: 1.2758553359122263e-6,
  },
  {
    tag_family: 'tag36h11',
    tag_id: 58,
    hamming: 0,
    decision_margin: 45.53330993652344,
    homography: [
      [-12.138870802738213, 9.008949089822691, 465.2880312215062],
      [-3.387987056042507, 17.226092761438593, 243.12372516193201],
      [-0.046387960566742194, 0.02646045853074842, 1.0],
    ],
    center: [465.2880312215062, 243.12372516193201],
    corners: [
      [453.40594482421875, 245.82951354980472],
      [471.55502319335943, 262.1865539550781],
      [479.037322998047, 239.99273681640625],
      [459.26593017578125, 224.8058013916016],
    ],
    pose_R: [
      [0.38979094, -0.02960901, 0.92042725],
      [0.50860639, 0.84014222, -0.18836294],
      [-0.76771255, 0.54155735, 0.34253915],
    ],
    pose_t: [[0.38605625], [0.0891109], [0.9842923]],
    pose_err: 8.490183858430691e-7,
  },
  {
    tag_family: 'tag36h11',
    tag_id: 85,
    hamming: 0,
    decision_margin: 43.85589599609375,
    homography: [
      [12.690213069656465, 7.130884973776803, 305.5869303424811],
      [0.4216883237572786, 12.534979617713901, 206.05103710368408],
      [0.00952116433006028, 0.019284835020760626, 1.0],
    ],
    center: [305.5869303424811, 206.05103710368408],
    corners: [
      [297.1265563964844, 216.05484008789062],
      [316.2967834472657, 212.87561035156253],
      [314.21414184570324, 195.84996032714847],
      [294.24176025390625, 198.82162475585935],
    ],
    pose_R: [
      [0.98145655, 0.08324834, -0.17266368],
      [-0.15866585, 0.85824867, -0.48809258],
      [0.10755548, 0.50643749, 0.85554245],
    ],
    pose_t: [[-0.11270233], [-0.02739123], [1.3634202]],
    pose_err: 3.2258577711256354e-7,
  },
  {
    tag_family: 'tag36h11',
    tag_id: 144,
    hamming: 0,
    decision_margin: 68.77212524414062,
    homography: [
      [16.78866730228791, -21.46172491665251, 187.8596631522523],
      [0.5030706352210937, -8.472651146628664, 319.8766787046075],
      [0.005134861627873914, -0.06855355743945672, 1.0],
    ],
    center: [187.8596631522523, 319.8766787046075],
    corners: [
      [161.51074218749997, 335.63323974609375],
      [195.59071350097656, 333.02725219726557],
      [210.59187316894534, 306.2828979492188],
      [181.05072021484375, 308.2946166992188],
    ],
    pose_R: [
      [0.97395978, -0.1070656, 0.19984822],
      [-0.12530794, 0.48039713, 0.86805329],
      [-0.18894516, -0.87049156, 0.45447131],
    ],
    pose_t: [[-0.32784718], [0.24187412], [0.75659253]],
    pose_err: 4.6407671563712075e-6,
  },
  {
    tag_family: 'tag36h11',
    tag_id: 198,
    hamming: 0,
    decision_margin: 43.743751525878906,
    homography: [
      [12.491079226570037, 3.494471241397549, 377.64266002007577],
      [1.1976315346509525, -3.152571009710101, 217.86663747643354],
      [0.028540737210407563, -0.016291942129491806, 1.0],
    ],
    center: [377.64266002007577, 217.86663747643354],
    corners: [
      [385.94918823242193, 223.53825378417966],
      [388.8650817871095, 213.29904174804685],
      [370.0489807128906, 212.68174743652347],
      [366.1419067382812, 222.54751586914065],
    ],
    pose_R: [
      [0.28303399, 0.95086059, 0.12552251],
      [-0.50456883, 0.03631815, 0.86260726],
      [0.8156605, -0.30748193, 0.49005388],
    ],
    pose_t: [[0.18221588], [0.0210869], [1.38373089]],
    pose_err: 1.8661165203563442e-7,
  },
]

// const applyRotationMatrix(object: THREE.Object3D, rmat: [Vector3, Vector3, Vector3]) {
//
//
//
// // Calculates rotation matrix to euler angles
// // The result is the same as MATLAB except the order
// // of the euler angles ( x and z are swapped ).
//
//
//   const sy = math.sqrt(rmat[0,0] * rmat[0,0] +  rmat[1,0] * rmat[1,0])
//
//   const singular = sy < 1e-6
//   let x, y, z
//   if  not singular :
//     x = math.atan2(rmat[2,1] , rmat[2,2])
//   y = math.atan2(-rmat[2,0], sy)
//   z = math.atan2(rmat[1,0], rmat[0,0])
// else :
//   x = math.atan2(-rmat[1,2], rmat[1,1])
//   y = math.atan2(-rmat[2,0], sy)
//   z = 0
//
//
// }

interface ICreateThreePartsOptions {
  canvas: HTMLCanvasElement
  width: number
  height: number
}

interface IProps {
  width: number
  height: number
}

const createThreeParts = ({
  canvas,
  width,
  height,
}: ICreateThreePartsOptions) => {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.z = 2
  const renderer = new THREE.WebGLRenderer({ canvas })
  const controls = new CameraControls(camera, renderer.domElement)
  const clock = new THREE.Clock()

  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const geo = new THREE.EdgesGeometry(geometry)
  const mat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 })
  const wireframe = new THREE.LineSegments(geo, mat)
  scene.add(wireframe)

  return {
    scene,
    camera,
    renderer,
    canvas,
    controls,
    planes: [] as THREE.Mesh[],
    clock,
  }
}

const createPlane = ({ color }: { color: string }) => {
  const geometry = new THREE.PlaneGeometry(0.08, 0.08, 32)
  const material = new THREE.MeshBasicMaterial({
    color,
    side: THREE.DoubleSide,
  })
  const plane = new THREE.Mesh(geometry, material)
  // plane.matrixAutoUpdate = false
  return plane
}

const updatePlanes = (
  threeParts: ReturnType<typeof createThreeParts>,
  detections: Detection[]
) => {
  const { scene, camera, renderer, planes } = threeParts

  const colors = randomColor({
    luminosity: 'light',
    count: detections.length,
    seed: 1,
  })
  for (const [i, detection] of detections.entries()) {
    if (!planes[i]) {
      planes.push(createPlane({ color: colors[i] }))
      scene.add(planes[i])
    }
    const [x, y, z] = detection.pose_t.map(([v]) => v * 1)
    planes[i].position.set(x, y, z)
    // planes[i].rotation.set(Math.random(), Math.random(), Math.random())
    const r = detection.pose_R
    const tmat = new THREE.Matrix4()
    tmat.set(
      r[0][0],
      r[0][1],
      r[0][1],
      x,
      r[1][0],
      r[1][1],
      r[1][1],
      y,
      r[2][0],
      r[2][1],
      r[2][1],
      z,
      0,
      0,
      0,
      1
    )
    // tmat.set(
    //   Math.random(),
    //   Math.random(),
    //   Math.random(),
    //   Math.random(),
    //   Math.random(),
    //   Math.random(),
    //   Math.random(),
    //   Math.random(),
    //   Math.random(),
    //   Math.random(),
    //   Math.random(),
    //   Math.random(),
    //   0,
    //   0,
    //   0,
    //   1
    // )
    // planes[i].matrix.set( -0.2967712, -0.6621376,  0.6881139,0,
    // 0.7396647, -0.6151495, -0.2729234,0,
    // 0.6040058,  0.4279777,  0.6723185,0,
    // 0,0,0,1)
    planes[i].rotation.setFromRotationMatrix(tmat)
    // planes[i].matrix.makeRotationX(Math.random())
    // planes[i].rotation.x = Math.random()
    // planes[i].matrixWorldNeedsUpdate = true
    // planes[i].updateMatrix()
    console.log('i', i)
    scene.add(planes[i])
    // console.log()
  }
  renderer.render(scene, camera)
}

export const Simulation: FC<IProps> = props => {
  const [threeParts, setThreeParts] = useState<ReturnType<
    typeof createThreeParts
  > | null>(null)
  const ref = useCallback((node: HTMLCanvasElement | null) => {
    if (node !== null) {
      setThreeParts(
        createThreeParts({
          canvas: node,
          width: props.width,
          height: props.height,
        })
      )
    }
  }, [])

  useEffect(() => {
    if (threeParts) {
      const { controls, clock, renderer, scene, camera } = threeParts
      // const geometry = new THREE.BoxGeometry(1, 1, 1)
      // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      // const cube = new THREE.Mesh(geometry, material)
      // scene.add(cube)

      const animate = () => {
        const delta = clock.getDelta()
        const hasControlsUpdated = controls.update(delta)

        requestAnimationFrame(animate)

        // you can skip this condition to render though
        if (hasControlsUpdated) {
          renderer.render(scene, camera)
        }
      }

      updatePlanes(threeParts, testDetections)
      renderer.render(scene, camera)
      animate()
    }

    ipcRenderer.on('zmq', (_: any, event: any) => {
      if (event.type === 'apriltags' && threeParts) {
        const detections: Detection[] = event.data
        updatePlanes(threeParts, detections)
      }
    })
  }, [threeParts])
  return (
    <div style={{ width: 640, height: 480 }}>
      <canvas width={640} height={480} ref={ref} />
    </div>
  )
}
