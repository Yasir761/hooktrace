
// "use client"

// import { useState } from "react"
// import type {
//   DeliveryTarget,
//   DeliveryTargetPayload,
//   TargetConfig,
// } from "@/types/delivery-target"

// /* ---------------- TYPES ---------------- */

// type Props = {
//   initial?: DeliveryTarget
//   onSubmit: (data: DeliveryTargetPayload) => Promise<void>
//   loading: boolean
// }

// const PROVIDERS = ["stripe", "shopify", "github", "slack"]

// /* ---------------- COMPONENT ---------------- */






// export default function TargetForm({ initial, onSubmit, loading }: Props) {
//   const [name, setName] = useState(initial?.name || "")
//   const [type, setType] = useState(initial?.type || "http")
//   const [providers, setProviders] = useState<string[]>(
//     initial?.providers || []
//   )

//   const [config, setConfig] = useState<TargetConfig>(
//     initial?.config || {}
//   )

//   /* ---------------- CONFIG UPDATE ---------------- */

//   function updateConfig<K extends keyof TargetConfig>(
//     key: K,
//     value: TargetConfig[K]
//   ) {
//     setConfig((prev) => ({
//       ...prev,
//       [key]: value,
//     }))
//   }
//   /* ---------------- PROVIDERS ---------------- */

//   function toggleProvider(p: string) {
//     setProviders((prev) =>
//       prev.includes(p)
//         ? prev.filter((x) => x !== p)
//         : [...prev, p]
//     )
//   }

//   /* ---------------- FIELD RENDER ---------------- */

//   function renderFields() {
//     switch (type) {
//       case "http":
//         return (
//           <>
//             <input
//               placeholder="URL"
//               value={config.url || ""}
//               onChange={(e) => updateConfig("url", e.target.value)}
//               className="input"
//             />

//             <input
//               placeholder="Method (POST)"
//               value={config.method || ""}
//               onChange={(e) => updateConfig("method", e.target.value)}
//               className="input"
//             />

//             <input
//               placeholder="Timeout (ms)"
//               value={config.timeout || ""}
//               onChange={(e) => updateConfig("timeout", e.target.value)}
//               className="input"
//             />

//             <input
//               placeholder="Retries"
//               value={config.retries || ""}
//               onChange={(e) => updateConfig("retries", e.target.value)}
//               className="input"
//             />

//             <input
//               placeholder="Secret (optional)"
//               value={config.secret || ""}
//               onChange={(e) => updateConfig("secret", e.target.value)}
//               className="input"
//             />

//             <textarea
//               placeholder='Headers JSON → {"Authorization":"Bearer xxx"}'
//               value={
//                 typeof config.headers === "string"
//                   ? config.headers
//                   : config.headers
//                   ? JSON.stringify(config.headers, null, 2)
//                   : ""
//               }
//               onChange={(e) => updateConfig("headers", e.target.value)}
//               className="input h-20"
//             />
//           </>
//         )

//       case "kafka":
//         return (
//           <>
//             <input
//               placeholder="Brokers"
//               value={config.brokers || ""}
//               onChange={(e) => updateConfig("brokers", e.target.value)}
//               className="input"
//             />
//             <input
//               placeholder="Topic"
//               value={config.topic || ""}
//               onChange={(e) => updateConfig("topic", e.target.value)}
//               className="input"
//             />
//           </>
//         )

//       case "redis":
//         return (
//           <>
//             <input
//               placeholder="Redis URL"
//               value={config.redisUrl || ""}
//               onChange={(e) => updateConfig("redisUrl", e.target.value)}
//               className="input"
//             />
//             <input
//               placeholder="Channel"
//               value={config.channel || ""}
//               onChange={(e) => updateConfig("channel", e.target.value)}
//               className="input"
//             />
//           </>
//         )

//       case "sqs":
//         return (
//           <>
//             <input
//               placeholder="Queue URL"
//               value={config.queueUrl || ""}
//               onChange={(e) => updateConfig("queueUrl", e.target.value)}
//               className="input"
//             />
//             <input
//               placeholder="Region"
//               value={config.region || ""}
//               onChange={(e) => updateConfig("region", e.target.value)}
//               className="input"
//             />
//           </>
//         )

//       case "rabbitmq":
//         return (
//           <>
//             <input
//               placeholder="Host (amqp://...)"
//               value={config.host || ""}
//               onChange={(e) => updateConfig("host", e.target.value)}
//               className="input"
//             />

//             <input
//               placeholder="Exchange"
//               value={config.exchange || ""}
//               onChange={(e) => updateConfig("exchange", e.target.value)}
//               className="input"
//             />

//             <input
//               placeholder="Routing Key"
//               value={config.routingKey || ""}
//               onChange={(e) => updateConfig("routingKey", e.target.value)}
//               className="input"
//             />
//           </>
//         )

//       case "slack":
//         return (
//           <>
//             <input
//               placeholder="Webhook URL"
//               value={config.webhookUrl || ""}
//               onChange={(e) => updateConfig("webhookUrl", e.target.value)}
//               className="input"
//             />
//           </>
//         )

//       case "email":
//         return (
//           <>
//             <input
//               placeholder="Recipients (comma separated)"
//               value={config.recipients || ""}
//               onChange={(e) => updateConfig("recipients", e.target.value)}
//               className="input"
//             />

//             <input
//               placeholder="Subject"
//               value={config.subject || ""}
//               onChange={(e) => updateConfig("subject", e.target.value)}
//               className="input"
//             />

//             <label className="text-xs flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={config.includePayload === true}
//                 onChange={(e) =>
//                   updateConfig("includePayload", e.target.checked)
//                 }
//               />
//               Include payload
//             </label>
//           </>
//         )

//       case "grpc":
//         return (
//           <>
//             <input
//               placeholder="gRPC URL"
//               value={config.grpcUrl || ""}
//               onChange={(e) => updateConfig("grpcUrl", e.target.value)}
//               className="input"
//             />
//           </>
//         )

//       default:
//         return null
//     }
//   }

//   /* ---------------- SUBMIT ---------------- */

//   async function handleSubmit() {
//     if (!name) {
//       alert("Target name is required")
//       return
//     }

//     if (type === "http" && !config.url) {
//       alert("URL is required")
//       return
//     }

//     if (type === "kafka" && !config.topic) {
//       alert("Topic is required")
//       return
//     }

//     if (type === "rabbitmq" && !config.host) {
//       alert("Host is required")
//       return
//     }

//     if (type === "slack" && !config.webhookUrl) {
//       alert("Webhook URL required")
//       return
//     }

//     if (type === "email" && !config.recipients) {
//       alert("Recipients required")
//       return
//     }

//     const finalConfig = { ...config }

//     // parse headers JSON safely
//     if (typeof finalConfig.headers === "string") {
//       try {
//         finalConfig.headers = JSON.parse(finalConfig.headers)
//       } catch {
//         alert("Invalid headers JSON")
//         return
//       }
//     }

//     await onSubmit({
//       name,
//       type,
//       config: finalConfig,
//       providers,
//     })
//   }

//   /* ---------------- UI ---------------- */

//   return (
//     <div className="space-y-5">

//       {/* Name */}
//       <input
//         placeholder="Target name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         className="input"
//       />

//       {/* Type */}
//       <select
//         value={type}
//         onChange={(e) => {
//           setType(e.target.value)
//           setConfig({})
//         }}
//         className="input"
//       >
//         <option value="http">HTTP</option>
//         <option value="kafka">Kafka</option>
//         <option value="redis">Redis</option>
//         <option value="sqs">SQS</option>
//         <option value="grpc">gRPC</option>
//         <option value="rabbitmq">RabbitMQ</option>
//         <option value="slack">Slack</option>
//         <option value="email">Email</option>
//       </select>

//       {/* Config */}
//       <div className="space-y-2">
//         <p className="text-sm font-medium">Configuration</p>
//         {renderFields()}
//       </div>

//       {/* Providers */}
//       <div className="space-y-2">
//         <p className="text-sm font-medium">Providers</p>

//         <div className="flex flex-wrap gap-2">
//           {PROVIDERS.map((p) => (
//             <button
//               key={p}
//               type="button"
//               onClick={() => toggleProvider(p)}
//               className={`text-xs px-2 py-1 rounded border ${
//                 providers.includes(p)
//                   ? "bg-primary text-white"
//                   : "bg-muted"
//               }`}
//             >
//               {p}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Submit */}
//       <button
//         onClick={handleSubmit}
//         disabled={loading}
//         className="btn w-full"
//       >
//         {loading ? "Saving..." : "Save Target"}
//       </button>
//     </div>
//   )
// }







"use client"

import { useState } from "react"
import type {
  DeliveryTarget,
  DeliveryTargetPayload,
  TargetConfig,
} from "@/types/delivery-target"

/* ---------------- TYPES ---------------- */

type Props = {
  initial?: DeliveryTarget
  onSubmit: (data: DeliveryTargetPayload) => Promise<void>
  loading: boolean
}

const PROVIDERS = ["stripe", "shopify", "github", "slack"]

/* ---------------- COMPONENT ---------------- */

export default function TargetForm({ initial, onSubmit, loading }: Props) {
  const [name, setName] = useState(initial?.name || "")
  const [type, setType] = useState(initial?.type || "http")
  const [providers, setProviders] = useState<string[]>(
    initial?.providers || []
  )

  const [config, setConfig] = useState<TargetConfig>(
    initial?.config || {}
  )

  const [error, setError] = useState<string | null>(null)

  /* ---------------- CONFIG UPDATE ---------------- */

  function updateConfig<K extends keyof TargetConfig>(
    key: K,
    value: TargetConfig[K]
  ) {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  /* ---------------- PROVIDERS ---------------- */

  function toggleProvider(p: string) {
    setProviders((prev) =>
      prev.includes(p)
        ? prev.filter((x) => x !== p)
        : [...prev, p]
    )
  }

  /* ---------------- FIELD RENDER ---------------- */

  function renderFields() {
    switch (type) {
      case "http":
        return (
          <>
            <input placeholder="URL" value={config.url || ""} onChange={(e) => updateConfig("url", e.target.value)} className="input" />
            <input placeholder="Method (POST)" value={config.method || ""} onChange={(e) => updateConfig("method", e.target.value)} className="input" />
            <input placeholder="Timeout (ms)" value={config.timeout || ""} onChange={(e) => updateConfig("timeout", e.target.value)} className="input" />
            <input placeholder="Retries" value={config.retries || ""} onChange={(e) => updateConfig("retries", e.target.value)} className="input" />
            <input placeholder="Secret" value={config.secret || ""} onChange={(e) => updateConfig("secret", e.target.value)} className="input" />

            <textarea
              placeholder='Headers JSON → {"Authorization":"Bearer xxx"}'
              value={
                typeof config.headers === "string"
                  ? config.headers
                  : config.headers
                  ? JSON.stringify(config.headers, null, 2)
                  : ""
              }
              onChange={(e) => updateConfig("headers", e.target.value)}
              className="input h-20"
            />

            <textarea
              placeholder="Transform (optional JS/template)"
              value={config.transform || ""}
              onChange={(e) => updateConfig("transform", e.target.value)}
              className="input h-20"
            />
          </>
        )

      case "kafka":
        return (
          <>
            <input placeholder="Brokers" value={config.brokers || ""} onChange={(e) => updateConfig("brokers", e.target.value)} className="input" />
            <input placeholder="Topic" value={config.topic || ""} onChange={(e) => updateConfig("topic", e.target.value)} className="input" />
            <input placeholder="Client ID" value={config.clientId || ""} onChange={(e) => updateConfig("clientId", e.target.value)} className="input" />
            <input placeholder="Username" value={config.username || ""} onChange={(e) => updateConfig("username", e.target.value)} className="input" />
            <input placeholder="Password" type="password" value={config.password || ""} onChange={(e) => updateConfig("password", e.target.value)} className="input" />
          </>
        )

      case "redis":
        return (
          <>
            <input placeholder="Redis URL" value={config.redisUrl || ""} onChange={(e) => updateConfig("redisUrl", e.target.value)} className="input" />
            <input placeholder="Channel" value={config.channel || ""} onChange={(e) => updateConfig("channel", e.target.value)} className="input" />
          </>
        )

      case "sqs":
        return (
          <>
            <input placeholder="Queue URL" value={config.queueUrl || ""} onChange={(e) => updateConfig("queueUrl", e.target.value)} className="input" />
            <input placeholder="Region" value={config.region || ""} onChange={(e) => updateConfig("region", e.target.value)} className="input" />
            <input placeholder="Access Key ID" value={config.accessKeyId || ""} onChange={(e) => updateConfig("accessKeyId", e.target.value)} className="input" />
            <input placeholder="Secret Access Key" value={config.secretAccessKey || ""} onChange={(e) => updateConfig("secretAccessKey", e.target.value)} className="input" />
            <input placeholder="Message Group ID (FIFO)" value={config.messageGroupId || ""} onChange={(e) => updateConfig("messageGroupId", e.target.value)} className="input" />
          </>
        )

      case "rabbitmq":
        return (
          <>
            <input placeholder="Host (amqp://...)" value={config.host || ""} onChange={(e) => updateConfig("host", e.target.value)} className="input" />
            <input placeholder="Exchange" value={config.exchange || ""} onChange={(e) => updateConfig("exchange", e.target.value)} className="input" />
            <input placeholder="Routing Key" value={config.routingKey || ""} onChange={(e) => updateConfig("routingKey", e.target.value)} className="input" />
          </>
        )

      case "slack":
        return (
          <>
            <input placeholder="Webhook URL" value={config.webhookUrl || ""} onChange={(e) => updateConfig("webhookUrl", e.target.value)} className="input" />
            <input placeholder="Channel (#alerts)" value={config.channel || ""} onChange={(e) => updateConfig("channel", e.target.value)} className="input" />
            <input placeholder="Mention on error (@team)" value={config.mentionOnError || ""} onChange={(e) => updateConfig("mentionOnError", e.target.value)} className="input" />
          </>
        )

      case "email":
        return (
          <>
            <input placeholder="Recipients" value={config.recipients || ""} onChange={(e) => updateConfig("recipients", e.target.value)} className="input" />
            <input placeholder="Subject" value={config.subject || ""} onChange={(e) => updateConfig("subject", e.target.value)} className="input" />
            <label className="text-xs flex items-center gap-2">
              <input type="checkbox" checked={config.includePayload === true} onChange={(e) => updateConfig("includePayload", e.target.checked)} />
              Include payload
            </label>
          </>
        )

      case "grpc":
        return (
          <>
            <input placeholder="gRPC URL" value={config.grpcUrl || ""} onChange={(e) => updateConfig("grpcUrl", e.target.value)} className="input" />
            <input placeholder="Service Name" value={config.service || ""} onChange={(e) => updateConfig("service", e.target.value)} className="input" />
          </>
        )

      default:
        return null
    }
  }

  /* ---------------- SUBMIT ---------------- */

  async function handleSubmit() {
    setError(null)

    if (!name) return setError("Target name is required")
    if (type === "http" && !config.url) return setError("URL is required")
    if (type === "kafka" && !config.topic) return setError("Topic required")
    if (type === "rabbitmq" && !config.host) return setError("Host required")
    if (type === "slack" && !config.webhookUrl) return setError("Webhook required")
    if (type === "email" && !config.recipients) return setError("Recipients required")

    const finalConfig = { ...config }

    if (typeof finalConfig.headers === "string") {
      try {
        finalConfig.headers = JSON.parse(finalConfig.headers)
      } catch {
        return setError("Invalid headers JSON")
      }
    }

    await onSubmit({
      name,
      type,
      config: finalConfig,
      providers,
    })
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-5">

      {error && (
        <div className="text-xs text-red-500 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <input
        placeholder="Target name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input"
      />

      <select
        value={type}
        onChange={(e) => {
          setType(e.target.value)
          setConfig({})
        }}
        className="input"
      >
        <option value="http">HTTP</option>
        <option value="kafka">Kafka</option>
        <option value="redis">Redis</option>
        <option value="sqs">SQS</option>
        <option value="grpc">gRPC</option>
        <option value="rabbitmq">RabbitMQ</option>
        <option value="slack">Slack</option>
        <option value="email">Email</option>
      </select>

      <div className="space-y-2">
        <p className="text-sm font-medium">Configuration</p>
        {renderFields()}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Providers</p>

        <div className="flex flex-wrap gap-2">
          {PROVIDERS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => toggleProvider(p)}
              className={`text-xs px-2 py-1 rounded border ${
                providers.includes(p)
                  ? "bg-primary text-white"
                  : "bg-muted"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="btn w-full"
      >
        {loading ? "Saving..." : "Save Target"}
      </button>
    </div>
  )
}