import Warp from './Warp'
import wave from './warp/transformers/wave'
import bulge from './warp/transformers/bulge'
import spiral from './warp/transformers/spiral'

Object.assign(Warp, { wave, bulge, spiral })

module.exports = Warp
