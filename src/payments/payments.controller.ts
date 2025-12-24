import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return 'data';
  }

  @Get()
  getPayments() {
    return 'success';
  }

  @Get('cancel')
  cancelPayment() {
    return 'cancelled';
  }

  @Post('webhook')
  stripeWebhook() {
    return 'webhook';
  }
}
