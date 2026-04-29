from decimal import Decimal

from django.db.models import Sum
from django.utils.dateparse import parse_date
from rest_framework.decorators import api_view
from rest_framework.response import Response

from operations.models import Debt, Transaction


def money_sum(queryset):
    return queryset.aggregate(total=Sum("amount"))["total"] or Decimal("0")


@api_view(["GET"])
def dashboard_summary(request):
    business_id = request.query_params.get("business")
    date_from = parse_date(request.query_params.get("date_from", ""))
    date_to = parse_date(request.query_params.get("date_to", ""))
    transactions = Transaction.objects.all()
    debts = Debt.objects.filter(is_closed=False)

    if request.user.is_authenticated:
        transactions = transactions.filter(business__owner=request.user)
        debts = debts.filter(business__owner=request.user)

    if business_id:
        transactions = transactions.filter(business_id=business_id)
        debts = debts.filter(business_id=business_id)
    if date_from:
        transactions = transactions.filter(happened_at__date__gte=date_from)
    if date_to:
        transactions = transactions.filter(happened_at__date__lte=date_to)

    revenue = money_sum(transactions.filter(type__in=[Transaction.Type.SALE, Transaction.Type.INCOME]))
    expenses = abs(money_sum(transactions.filter(type=Transaction.Type.EXPENSE)))
    receivable = money_sum(debts.filter(direction=Debt.Direction.RECEIVABLE))
    payable = money_sum(debts.filter(direction=Debt.Direction.PAYABLE))
    by_type = {
        item["type"]: item["total"] or Decimal("0")
        for item in transactions.values("type").annotate(total=Sum("amount"))
    }

    return Response(
        {
            "revenue": revenue,
            "expenses": expenses,
            "profit_estimate": revenue - expenses,
            "receivable": receivable,
            "payable": payable,
            "transactions_count": transactions.count(),
            "open_debts_count": debts.count(),
            "by_type": by_type,
        }
    )

# Create your views here.
