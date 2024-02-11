import { Context, Schema } from 'koishi'

export const name = 'number-linker'

export interface Config {
  enabledGuilds: Array<string>,
  frontLink: string,
  backLink: string,
}

export const Config: Schema<Config> = Schema.object({
  enabledGuilds: Schema.array(String).role('table').description('启用的群组').required(),
  frontLink: Schema.string().default("https://dev.itzdrli.com/topic/").description("链接的前半部分(数字前的内容)"),
  backLink: Schema.string().default("/").description("链接的后半部分")
})

function isNumericAndLessThanFourDigits(input: string): boolean { //Thank you ChatGPT
  const regex = /^\d{1,4}$/;
  return regex.test(input);
}

export function apply(ctx: Context, config: Config) {
  ctx.on('message-created', (session) => {
    if (!isNumericAndLessThanFourDigits(session.content)) return
    if (!config.enabledGuilds.includes(session.guildId)) return

    const response = config.frontLink + session.content + config.backLink
    session.send(response)
    return
  })
}
