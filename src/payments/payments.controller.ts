import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentSessionDto } from './dto/create-payment.dto';
import type { Request, Response } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-session')
  createPayment(@Body() createPaymentDto: PaymentSessionDto) {
    return this.paymentsService.createPaymentSession(createPaymentDto);
  }

  @Get('success')
  getPayments() {
    return 'success';
  }

  @Get('cancel')
  cancelPayment() {
    return 'cancelled';
  }

  @Post('webhook')
  stripeWebhook(@Req() req: RawBodyRequest<Request>, @Res() res: Response) {
    return this.paymentsService.stripeWebhook(req, res);
  }
}
