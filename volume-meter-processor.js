class VolumeMeterProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.volume = 0;
        this.port.onmessage = (event) => {
            if (event.data === 'reset') {
                this.volume = 0;
            }
        };
    }

    process(inputs) {
        const input = inputs[0];
        if (input.length > 0) {
            const channelData = input[0];
            let sum = 0.0;
            for (let i = 0; i < channelData.length; i++) {
                sum += channelData[i] * channelData[i];
            }
            const rms = Math.sqrt(sum / channelData.length);
            this.volume = Math.max(rms, this.volume * 0.95);
            this.port.postMessage(this.volume);
        }
        return true;
    }
}

registerProcessor('volume-meter-processor', VolumeMeterProcessor);
