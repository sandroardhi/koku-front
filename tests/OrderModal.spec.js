import { mount } from '@vue/test-utils';
import OrderModal from '../src/components/order/OrderModal.vue'

describe('OrderModal', () => {
  it('emits pengantarNotFound event when pengantar is not found', async () => {
    // Mount the component
    const wrapper = mount(OrderModal);

    // Simulate the condition where pengantar is not found
    // In your case, this might involve setting up the component state
    // or calling a method that triggers the emission of pengantarNotFound event
    // For example:
    // wrapper.vm.methodThatTriggersPengantarNotFound();

    // Wait for the next tick of the event loop to ensure any asynchronous
    // operations triggered by the method above have completed
    await wrapper.vm.$nextTick();

    // Assert that the component emitted the pengantarNotFound event
    expect(wrapper.emitted('pengantarNotFound')).toBeTruthy();

    // Optional: You can also assert the payload of the emitted event
    expect(wrapper.emitted('pengantarNotFound')[0]).toEqual(['Pengantar tidak ditemukan']);
  });
});
