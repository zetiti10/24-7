const mineflayer = require("mineflayer")

function writeVarInt(value) {
  const bytes = []

  do {
    let temp = value & 0x7f
    value >>>= 7

    if (value !== 0) {
      temp |= 0x80
    }

    bytes.push(temp)
  } while (value !== 0)

  return Buffer.from(bytes)
}

function writeString(str) {
  const data = Buffer.from(str, 'utf8')
  return Buffer.concat([
    writeVarInt(data.length),
    data
  ])
}

function sendAuthMeLogin(bot, password) {
  const id = 'authme:prejoin-login/submit'
  const key = Buffer.from('password', 'utf8')
  const value = Buffer.from(password, 'utf8')

  // Anonymous NBT:
  //
  // 0A                         TAG_Compound
  // 08                         TAG_String
  // 00 08 "password"          nom
  // 00 XX "..."                valeur
  // 00                         TAG_End
  //
  const nbt = Buffer.alloc(
    1 +                    // TAG_Compound
    1 + 2 + key.length +   // TAG_String + name
    2 + value.length +     // string value
    1                      // TAG_End
  )

  let offset = 0

  nbt.writeUInt8(0x0A, offset++) // TAG_Compound

  nbt.writeUInt8(0x08, offset++) // TAG_String

  nbt.writeUInt16BE(key.length, offset)
  offset += 2

  key.copy(nbt, offset)
  offset += key.length

  nbt.writeUInt16BE(value.length, offset)
  offset += 2

  value.copy(nbt, offset)
  offset += value.length

  nbt.writeUInt8(0x00, offset++) // TAG_End

  const packet = Buffer.concat([
    Buffer.from([0x08]),     // custom_click_action packet ID
    writeString(id),         // identifier
    writeVarInt(nbt.length), // length-prefixed NBT
    nbt
  ])

  //console.log('custom_click_action:', packet.toString('hex'))

  bot._client.writeRaw(packet)
}

module.exports = { sendAuthMeLogin }